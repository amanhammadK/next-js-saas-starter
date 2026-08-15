export default function Landing() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Your SaaS Product</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>The best solution for your business needs.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button style={{ padding: '0.75rem 2rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Get Started</button>
        <button style={{ padding: '0.75rem 2rem', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>Learn More</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '3rem', textAlign: 'left' }}>
        {['Feature One', 'Feature Two', 'Feature Three'].map(f => (
          <div key={f} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px' }}>
            <h3>{f}</h3>
            <p style={{ color: '#666' }}>Description of {f.toLowerCase()} goes here.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
