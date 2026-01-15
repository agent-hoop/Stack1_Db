import { useEffect, useState } from "react";

export default function useApi(api, cat = "", count = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function getData() {
      try {
        setLoading(true);

        const url = count
          ? `${api}/count`
          : `${api}?category=${encodeURIComponent(cat)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Request failed");

        const json = await res.json();
        if (alive) setData(json);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    }
    getData();
    return () => (alive = false);
  }, [api, cat, count]);

  return { data, loading, error };
}
