import { useEffect, useState, useCallback } from "react";
import { api, getApiErrorMessage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export function useBookings({ userId } = {}) {
  const { user } = useAuth();
  const targetId = userId || user?.id;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/bookings/${targetId}`);
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { bookings, loading, error, refetch: fetch };
}
