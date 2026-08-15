import { z } from "zod";

export const CreateSubscriptionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  plan: z.enum(["free", "starter", "pro", "enterprise"]),
  billingCycle: z.enum(["monthly", "annual"]).optional().default("monthly"),
  paymentMethodId: z.string().optional(),
});

export const GetSubscriptionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const CancelSubscriptionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  reason: z.string().optional(),
  effectiveDate: z.enum(["immediate", "end_of_period"]).optional().default("end_of_period"),
});

export const UpgradeSubscriptionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  newPlan: z.enum(["starter", "pro", "enterprise"]),
  billingCycle: z.enum(["monthly", "annual"]).optional().default("monthly"),
});

export const TrackUsageSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  metric: z.enum(["api_calls", "storage_bytes", "compute_seconds", "bandwidth_bytes"]),
  quantity: z.number().positive("Quantity must be positive"),
  metadata: z.record(z.any()).optional(),
});

export const GetUsageSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  period: z.enum(["current", "previous", "last_30d"]).optional().default("current"),
});

export const CreateInvoiceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  items: z.array(z.object({ description: z.string(), amount: z.number().positive(), quantity: z.number().positive().default(1) })),
});

export const InviteMemberSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["member", "admin", "viewer"]).optional().default("member"),
  invitedBy: z.string().min(1, "Inviter user ID required"),
});

export const RemoveMemberSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  userId: z.string().min(1, "User ID to remove required"),
  removedBy: z.string().min(1, "Remover user ID required"),
});

export const UpdateMemberRoleSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  userId: z.string().min(1, "User ID required"),
  newRole: z.enum(["owner", "admin", "member", "viewer"]),
  updatedBy: z.string().min(1, "Updater user ID required"),
});
