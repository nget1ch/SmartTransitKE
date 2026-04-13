import { useEffect, useState, useCallback } from "react";
import { api, getApiErrorMessage } from "@/services/api";

export function useRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/routes");
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { routes, loading, error, refetch: fetch };
}
