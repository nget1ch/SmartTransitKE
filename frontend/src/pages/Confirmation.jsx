import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { api, getApiErrorMessage } from "../services/api.js";

const PRICE_KES = 1200;

export default function Confirmation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedTrip, selectedSeat, draftBooking, setDraftBooking, resetFlow } = useBooking();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const tripSummary = useMemo(() => {
    if (!selectedTrip) return null;
    return `${selectedTrip.route?.origin} to ${selectedTrip.route?.destination} at ${new Date(
      selectedTrip.departureTime
    ).toLocaleString()}`;
  }, [selectedTrip]);

  async function proceedToPayment() {
    if (!selectedTrip || !selectedSeat || !user?.id) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const bookingRes =
        draftBooking ||
        (await api.post("/bookings", {
          tripId: selectedTrip.id,
          seatNumber: selectedSeat,
        })).data;

      setDraftBooking(bookingRes);

      await api.post("/payments", {
        bookingId: bookingRes.id,
        amount: PRICE_KES,
      });

      setMessage("Payment successful. Your seat is confirmed.");
      setTimeout(() => {
        resetFlow();
        navigate("/bookings");
      }, 900);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!selectedTrip || !selectedSeat) {
    return (
      <section className="space-y-4">
        <Alert
          type="info"
          title="No booking selected"
          message="Choose a trip and seat first before confirming payment."
        />
        <Link className="btn-primary" to="/trips">
          Go to Trips
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Booking Confirmation</h1>
        <p className="mt-1 text-sm text-slate-600">Review your booking details and proceed to payment.</p>

        <div className="mt-5 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <p>
            <span className="font-semibold text-slate-900">Trip:</span> {tripSummary}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Seat:</span> {selectedSeat}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Price:</span> KES {PRICE_KES.toLocaleString()}
          </p>
        </div>

        {error ? <div className="mt-4"><Alert type="error" message={error} /></div> : null}
        {message ? <div className="mt-4"><Alert type="success" message={message} /></div> : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-secondary" to={`/seats/${selectedTrip.id}`}>
            Change Seat
          </Link>
          <button className="btn-primary" onClick={proceedToPayment} disabled={loading}>
            {loading ? "Processing payment..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </section>
  );
}

