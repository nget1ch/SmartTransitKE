import { useEffect, useState } from "react";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api, getApiErrorMessage } from "../services/api.js";

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function Bookings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      if (!user?.id) return;
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/bookings/${user.id}`);
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [user?.id]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-sm text-slate-600">Track all your reserved seats and payment status.</p>
      </div>

      {loading ? <Loader label="Loading bookings..." /> : null}
      {error ? <Alert type="error" title="Could not load bookings" message={error} /> : null}

      {!loading && !error && bookings.length === 0 ? (
        <Alert type="info" title="No bookings yet" message="Once you reserve a seat, it will appear here." />
      ) : null}

      <div className="grid gap-3">
        {bookings.map((booking) => (
          <article key={booking.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  {booking.trip?.route?.origin} to {booking.trip?.route?.destination}
                </p>
                <h3 className="text-base font-bold text-slate-900">{formatDate(booking.trip?.departureTime)}</h3>
                <p className="text-sm text-slate-500">Seat #{booking.seatNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">Payment</p>
                <p
                  className={`text-sm font-semibold ${
                    booking.payment?.status === "PAID" ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {booking.payment?.status || "PENDING"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

