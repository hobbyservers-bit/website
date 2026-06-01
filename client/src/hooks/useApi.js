import { useState, useEffect } from 'react';

// In dev: Vite proxies /api → localhost:3001 (no prefix needed)
// In prod: VITE_API_URL = your Render service URL e.g. https://hobbyservers-api.onrender.com
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export default function useApi(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    fetch(API_BASE + url)
      .then(r => r.json())
      .then(json => { if (!cancelled) { setData(json); setLoading(false); } })
      .catch(err  => { if (!cancelled) { setError(err); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
