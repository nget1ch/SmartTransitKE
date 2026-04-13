import { useEffect, useState, useCallback } from "react";
import { api, getApiErrorMessage } from "@/services/api";

export function useTrips({ origin, destination } = {}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      const res = await api.get("/trips", { params });
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [origin, destination]);

  useEffect(() => { fetch(); }, [fetch]);

  return { trips, loading, error, refetch: fetch };
}
