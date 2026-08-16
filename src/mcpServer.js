import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  CreateSubscriptionSchema,
  GetSubscriptionSchema,
  CancelSubscriptionSchema,
  UpgradeSubscriptionSchema,
  TrackUsageSchema,
  GetUsageSchema,
  CreateInvoiceSchema,
  InviteMemberSchema,
  RemoveMemberSchema,
  UpdateMemberRoleSchema,
} from "./schemas.js";

const PLANS = {
  free: { name: "Free", monthlyPrice: 0, annualPrice: 0, limits: { api_calls: 1000, storage_bytes: 1073741824, compute_seconds: 3600, bandwidth_bytes: 1073741824 } },
  starter: { name: "Starter", monthlyPrice: 29, annualPrice: 278, limits: { api_calls: 100000, storage_bytes: 10737418240, compute_seconds: 86400, bandwidth_bytes: 10737418240 } },
  pro: { name: "Pro", monthlyPrice: 79, annualPrice: 758, limits: { api_calls: 1000000, storage_bytes: 107374182400, compute_seconds: 604800, bandwidth_bytes: 107374182400 } },
  enterprise: { name: "Enterprise", monthlyPrice: 299, annualPrice: 2870, limits: { api_calls: -1, storage_bytes: -1, compute_seconds: -1, bandwidth_bytes: -1 } },
};

const USAGE_PRICING = { api_calls: 0.001, storage_bytes: 0.00000001, compute_seconds: 0.0001, bandwidth_bytes: 0.000000008 };

class BillingStore {
  constructor() {
    this.subscriptions = new Map();
    this.usage = new Map();
    this.invoices = new Map();
    this.teams = new Map();
  }

  createSubscription(userId, plan, billingCycle, paymentMethodId) {
    const planData = PLANS[plan];
    if (!planData) return { error: `Invalid plan: ${plan}` };
    const existing = this.subscriptions.get(userId);
    if (existing && existing.status === "active") return { error: "User already has an active subscription" };
    const price = billingCycle === "annual" ? planData.annualPrice : planData.monthlyPrice;
    const sub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      plan,
      planName: planData.name,
      billingCycle,
      price,
      status: "active",
      paymentMethodId: paymentMethodId || null,
      createdAt: new Date().toISOString(),
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + (billingCycle === "annual" ? 365 : 30) * 86400000).toISOString(),
      cancelAt: null,
      limits: { ...planData.limits },
    };
    this.subscriptions.set(userId, sub);
    if (!this.usage.has(userId)) this.usage.set(userId, {});
    return { subscription: sub };
  }

  getSubscription(userId) {
    const sub = this.subscriptions.get(userId);
    if (!sub) return { error: "No subscription found" };
    const now = new Date();
    const periodEnd = new Date(sub.currentPeriodStart);
    periodEnd.setMonth(periodEnd.getMonth() + (sub.billingCycle === "annual" ? 12 : 1));
    sub.currentPeriodEnd = periodEnd.toISOString();
    return { subscription: sub };
  }

  cancelSubscription(userId, reason, effectiveDate) {
    const sub = this.subscriptions.get(userId);
    if (!sub) return { error: "No subscription found" };
    if (sub.status !== "active") return { error: "Subscription is not active" };
    sub.status = effectiveDate === "immediate" ? "cancelled" : "active";
    sub.cancelAt = effectiveDate === "immediate" ? new Date().toISOString() : sub.currentPeriodEnd;
    sub.cancelReason = reason || null;
    return { subscription: sub, message: effectiveDate === "immediate" ? "Cancelled immediately" : `Will cancel at end of period (${sub.currentPeriodEnd})` };
  }

  upgradeSubscription(userId, newPlan, billingCycle) {
    const sub = this.subscriptions.get(userId);
    if (!sub) return { error: "No subscription found" };
    const newPlanData = PLANS[newPlan];
    if (!newPlanData) return { error: `Invalid plan: ${newPlan}` };
    const oldPlan = sub.plan;
    const oldPrice = sub.price;
    const newPrice = billingCycle === "annual" ? newPlanData.annualPrice : newPlanData.monthlyPrice;
    const prorated = sub.billingCycle === billingCycle ? Math.round(((newPrice - oldPrice) * 0.3) * 100) / 100 : 0;
    sub.plan = newPlan;
    sub.planName = newPlanData.name;
    sub.billingCycle = billingCycle;
    sub.price = newPrice;
    sub.limits = { ...newPlanData.limits };
    sub.upgradedAt = new Date().toISOString();
    return { subscription: sub, upgrade: { from: oldPlan, to: newPlan, previousPrice: oldPrice, newPrice, proratedCharge: prorated } };
  }

  trackUsage(userId, metric, quantity, metadata) {
    const sub = this.subscriptions.get(userId);
    const currentPeriod = this.getCurrentPeriod(userId);
    const key = `${userId}:${currentPeriod}`;
    if (!this.usage.has(key)) this.usage.set(key, {});
    const periodUsage = this.usage.get(key);
    periodUsage[metric] = (periodUsage[metric] || 0) + quantity;
    if (sub && sub.limits[metric] > 0 && periodUsage[metric] > sub.limits[metric]) {
      return { warning: `Usage limit exceeded for ${metric}: ${periodUsage[metric]}/${sub.limits[metric]}`, currentUsage: periodUsage[metric], limit: sub.limits[metric] };
    }
    return { success: true, metric, quantity, totalForPeriod: periodUsage[metric], limit: sub?.limits[metric] || -1 };
  }

  getUsage(userId, period) {
    const periodKey = period === "current" ? this.getCurrentPeriod(userId) : period === "previous" ? this.getPreviousPeriod(userId) : this.getLast30Days(userId);
    const key = `${userId}:${periodKey}`;
    const periodUsage = this.usage.get(key) || {};
    const sub = this.subscriptions.get(userId);
    const usageReport = {};
    for (const [metric, used] of Object.entries(periodUsage)) {
      const limit = sub?.limits[metric] || 0;
      const overage = limit > 0 ? Math.max(0, used - limit) : 0;
      const estimatedOverageCost = overage * (USAGE_PRICING[metric] || 0);
      usageReport[metric] = { used, limit, percentage: limit > 0 ? Math.round((used / limit) * 100) : 0, overage, estimatedOverageCost };
    }
    return { userId, period: periodKey, usage: usageReport };
  }

  createInvoice(userId, items) {
    let subtotal = 0;
    const lineItems = items.map((item) => {
      const amount = item.amount * (item.quantity || 1);
      subtotal += amount;
      return { ...item, totalAmount: amount };
    });
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    const invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      items: lineItems,
      subtotal,
      tax,
      total,
      currency: "USD",
      status: "pending",
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    if (!this.invoices.has(userId)) this.invoices.set(userId, []);
    this.invoices.get(userId).push(invoice);
    return { invoice };
  }

  getInvoices(userId) {
    return this.invoices.get(userId) || [];
  }

  getBillingPortal(userId) {
    const sub = this.subscriptions.get(userId);
    const invoices = this.getInvoices(userId);
    const usage = this.getUsage(userId, "current");
    return { subscription: sub, invoices, currentUsage: usage, paymentMethods: sub?.paymentMethodId ? [{ id: sub.paymentMethodId, type: "card", last4: "4242" }] : [] };
  }

  getCurrentPeriod(userId) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  getPreviousPeriod(userId) {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  getLast30Days() {
    return `30d_${Date.now()}`;
  }

  inviteMember(teamId, email, role, invitedBy) {
    if (!this.teams.has(teamId)) this.teams.set(teamId, { members: [], invitations: [] });
    const team = this.teams.get(teamId);
    const existing = team.members.find((m) => m.email === email);
    if (existing) return { error: "User is already a team member" };
    const invite = {
      id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      teamId,
      email,
      role,
      invitedBy,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    };
    team.invitations.push(invite);
    return { invitation: invite };
  }

  removeMember(teamId, userId, removedBy) {
    const team = this.teams.get(teamId);
    if (!team) return { error: "Team not found" };
    const idx = team.members.findIndex((m) => m.userId === userId);
    if (idx === -1) return { error: "Member not found" };
    const removed = team.members.splice(idx, 1)[0];
    return { removed, teamSize: team.members.length };
  }

  updateMemberRole(teamId, userId, newRole, updatedBy) {
    const team = this.teams.get(teamId);
    if (!team) return { error: "Team not found" };
    const member = team.members.find((m) => m.userId === userId);
    if (!member) return { error: "Member not found" };
    const oldRole = member.role;
    member.role = newRole;
    member.updatedAt = new Date().toISOString();
    return { member, oldRole, newRole };
  }

  getTeam(teamId) {
    const team = this.teams.get(teamId);
    if (!team) return { error: "Team not found" };
    return { team: { id: teamId, members: team.members, invitations: team.invitations.filter((i) => i.status === "pending") } };
  }
}

const store = new BillingStore();

export class NextJsSaasStarterServer {
  constructor() {
    this.server = new McpServer({
      name: "next-js-saas-starter",
      version: "1.0.0",
    });
    this.setupTools();
  }

  setupTools() {
    this.server.tool(
      "create_subscription",
      "Create a new subscription with plan selection, billing cycle, and payment method",
      CreateSubscriptionSchema.shape,
      async (args) => {
        const result = store.createSubscription(args.userId, args.plan, args.billingCycle, args.paymentMethodId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "get_subscription",
      "Get full subscription details including current period and limits",
      GetSubscriptionSchema.shape,
      async (args) => {
        const result = store.getSubscription(args.userId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "cancel_subscription",
      "Cancel a subscription with reason and effective date control",
      CancelSubscriptionSchema.shape,
      async (args) => {
        const result = store.cancelSubscription(args.userId, args.reason, args.effectiveDate);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "upgrade_subscription",
      "Upgrade to a higher plan with prorated billing calculation",
      UpgradeSubscriptionSchema.shape,
      async (args) => {
        const result = store.upgradeSubscription(args.userId, args.newPlan, args.billingCycle);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "track_usage",
      "Record API calls, storage, compute, or bandwidth usage with limit checking",
      TrackUsageSchema.shape,
      async (args) => {
        const result = store.trackUsage(args.userId, args.metric, args.quantity, args.metadata);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "get_usage",
      "Get usage report with limit percentages and overage cost estimates",
      GetUsageSchema.shape,
      async (args) => {
        const result = store.getUsage(args.userId, args.period);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "create_invoice",
      "Generate an invoice with line items, tax calculation, and due date",
      CreateInvoiceSchema.shape,
      async (args) => {
        const result = store.createInvoice(args.userId, args.items);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "get_billing_portal",
      "Get full billing portal data: subscription, invoices, usage, payment methods",
      z.object({ userId: z.string() }).shape,
      async (args) => {
        const result = store.getBillingPortal(args.userId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "invite_member",
      "Invite a team member by email with role assignment",
      InviteMemberSchema.shape,
      async (args) => {
        const result = store.inviteMember(args.teamId, args.email, args.role, args.invitedBy);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "remove_member",
      "Remove a member from a team",
      RemoveMemberSchema.shape,
      async (args) => {
        const result = store.removeMember(args.teamId, args.userId, args.removedBy);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "update_member_role",
      "Change a team member's role with audit trail",
      UpdateMemberRoleSchema.shape,
      async (args) => {
        const result = store.updateMemberRole(args.teamId, args.userId, args.newRole, args.updatedBy);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );

    this.server.tool(
      "get_team",
      "Get team details including members and pending invitations",
      z.object({ teamId: z.string() }).shape,
      async (args) => {
        const result = store.getTeam(args.teamId);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("Next.js SaaS Subscription MCP Server running on stdio");
  }
}
