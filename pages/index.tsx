export default function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a', background: '#fff' }}>
      <header style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #eef2f7', zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>S</div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Startuply</span>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#475569' }}>
            <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Features</a>
            <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</a>
            <a href="#faq" style={{ textDecoration: 'none', color: 'inherit' }}>FAQ</a>
          </nav>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <a href="#" style={{ fontSize: '0.875rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>Log in</a>
            <a href="#" style={{ background: '#6366f1', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>Start free</a>
          </div>
        </div>
      </header>

      <section style={{ textAlign: 'center', padding: '5rem 1.5rem 3rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#eef2ff', color: '#4f46e5', fontSize: '0.8rem', padding: '0.35rem 0.9rem', borderRadius: 999, marginBottom: '1.25rem', fontWeight: 600 }}>
          New: AI-powered analytics are here
        </div>
        <h1 style={{ fontSize: '3rem', lineHeight: 1.1, margin: '0 0 1rem', fontWeight: 800 }}>
          The simplest way to run your <span style={{ color: '#6366f1' }}>SaaS business</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: 620, margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Billing, subscriptions, analytics, and customer management — all in one place. Built to scale from your first paying customer to your millionth.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
          <a href="#pricing" style={{ background: '#6366f1', color: '#fff', padding: '0.8rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>Get started free</a>
          <a href="#features" style={{ border: '1px solid #e2e8f0', color: '#0f172a', padding: '0.8rem 1.75rem', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>See how it works</a>
        </div>
        <div style={{ marginTop: '3.5rem', background: 'linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%)', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {['Total MRR', 'Active users', 'Churn rate'].map(l => (
              <div key={l} style={{ flex: 1, background: '#fff', borderRadius: 10, padding: '1rem', border: '1px solid #eef2f7' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.25rem' }}>$48,200</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: 10, padding: '1.25rem', border: '1px solid #eef2f7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              <span>Revenue growth</span><span style={{ color: '#10b981', fontWeight: 600 }}>+32% this quarter</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', height: 90 }}>
              {[40, 55, 48, 70, 65, 82, 78, 95, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 8 ? '#6366f1' : '#c7d2fe', borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>Everything your team needs</h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>One platform, no more switching between five tools.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            ['Billing & Invoicing', 'Automated invoicing, dunning, and tax handling that just works.'],
            ['Subscriptions', 'Plans, add-ons, trials, and proration handled out of the box.'],
            ['Analytics', 'Understand revenue, churn, and cohort behavior at a glance.'],
            ['Customer Portal', 'Let customers manage their own plans, payments, and invoices.'],
            ['Webhooks', 'Stream every event to your stack in real time.'],
            ['API-first', 'Build on a clean REST API with first-class SDKs.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ background: '#f8fafc', border: '1px solid #eef2f7', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: 700, marginBottom: '0.75rem' }}>✓</div>
              <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem' }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ background: '#f8fafc', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>Simple, transparent pricing</h2>
            <p style={{ color: '#64748b' }}>Start free. Upgrade when you're ready.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { name: 'Starter', price: '$0', desc: 'For side projects', features: ['1,000 customers', '3 team members', 'Core billing', 'Community support'] },
              { name: 'Growth', price: '$49', desc: 'For growing teams', features: ['50,000 customers', 'Unlimited team', 'Analytics & cohorts', 'Webhooks', 'Priority support'], popular: true },
              { name: 'Scale', price: '$199', desc: 'For businesses at scale', features: ['Unlimited customers', 'Dedicated success manager', 'Custom contracts', 'SLA & SSO', '24/7 support'] },
            ].map(p => (
              <div key={p.name} style={{
                background: '#fff', borderRadius: 14, padding: '1.75rem', border: p.popular ? '2px solid #6366f1' : '1px solid #e2e8f0',
                position: 'relative', boxShadow: p.popular ? '0 12px 30px rgba(99,102,241,0.15)' : 'none',
              }}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.9rem', borderRadius: 999 }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{p.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem' }}>{p.desc}</p>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.25rem' }}>{p.price}<span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/mo</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {p.features.map(f => (
                    <div key={f} style={{ fontSize: '0.875rem', color: '#475569' }}>✓ {f}</div>
                  ))}
                </div>
                <button style={{
                  width: '100%', padding: '0.7rem', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
                  background: p.popular ? '#6366f1' : '#fff', color: p.popular ? '#fff' : '#0f172a', border: p.popular ? 'none' : '1px solid #e2e8f0',
                }}>
                  Choose {p.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', margin: '0 0 2rem' }}>Frequently asked questions</h2>
        {[
          ['Can I cancel anytime?', 'Yes. Plans are month-to-month and you can cancel or downgrade any time from the billing dashboard.'],
          ['Do you offer a free trial?', 'The Starter plan is free forever. Paid plans include a 14-day trial with no credit card required.'],
          ['Is my data secure?', 'Data is encrypted at rest and in transit, with SOC 2 Type II compliance and EU/US data residency options.'],
        ].map(([q, a]) => (
          <div key={q} style={{ borderBottom: '1px solid #eef2f7', padding: '1.25rem 0' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 0.4rem' }}>{q}</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{a}</p>
          </div>
        ))}
      </section>

      <section style={{ background: '#0f172a', color: '#fff', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', margin: '0 0 1rem' }}>Ready to launch your SaaS?</h2>
        <p style={{ color: '#94a3b8', margin: '0 auto 2rem', maxWidth: 500, fontSize: '1rem' }}>Join thousands of companies building with Startuply. Set up takes less than five minutes.</p>
        <a href="#pricing" style={{ background: '#6366f1', color: '#fff', padding: '0.9rem 2rem', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: '1rem' }}>Start your free trial</a>
      </section>

      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '2rem 1.5rem', borderTop: '1px solid #1e293b', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>S</div>
            <span style={{ fontWeight: 600 }}>Startuply</span>
          </div>
          <div>© 2026 Startuply Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}