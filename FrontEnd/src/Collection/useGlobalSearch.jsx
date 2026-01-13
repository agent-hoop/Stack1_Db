import { useEffect, useState } from "react";

export function useGlobalSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        setResults(json);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { results, loading };
}
