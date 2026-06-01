import { useEffect } from 'react';

export default function Credits() {
  useEffect(() => {
    window.location.href = 'https://dash.hobbyservers.com/shop';
  }, []);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      fontFamily: 'var(--font-body)',
      color: 'var(--gray-600)',
    }}>
      <img src="/assets/asset-4.png" alt="" style={{ width: 52, borderRadius: 12 }} />
      <p style={{ fontSize: 15 }}>Redirecting to the shop…</p>
    </div>
  );
}
