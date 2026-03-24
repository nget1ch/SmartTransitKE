import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import SeatGrid from "../components/SeatGrid.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { api, getApiErrorMessage } from "../services/api.js";

export default function Seats() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { selectedTrip, setSelectedTrip, selectedSeat, setSelectedSeat } = useBooking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [tripRes, availRes] = await Promise.all([
          api.get("/trips"),
          api.get(`/trips/${tripId}/availability`, {
            params: { includeSeats: "true", availableLimit: 200 },
          }),
        ]);

        const trip = (tripRes.data || []).find((t) => t.id === tripId);
        if (trip) setSelectedTrip(trip);
        setAvailability(availRes.data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tripId, setSelectedTrip]);

  const capacity = useMemo(
    () => availability?.capacity || selectedTrip?.capacity || selectedTrip?.bus?.capacity || 0,
    [availability, selectedTrip]
  );
  const bookedSeats = availability?.bookedSeats || [];

  function confirmSelection() {
    if (!selectedSeat) return;
    navigate("/confirm");
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seat Selection</h1>
          <p className="text-sm text-slate-600">Select one available seat for your trip.</p>
        </div>
        <Link className="btn-secondary" to="/trips">
          Back to Trips
        </Link>
      </div>

      {loading ? <Loader label="Loading seat availability..." /> : null}
      {error ? <Alert type="error" title="Could not load seats" message={error} /> : null}

      {!loading && !error ? (
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-white ring-1 ring-slate-300" /> Available
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-brand-600" /> Selected
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-slate-200" /> Booked
            </span>
          </div>

          <SeatGrid
            capacity={capacity}
            bookedSeats={bookedSeats}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
          />

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Selected seat: <span className="font-semibold text-slate-900">{selectedSeat || "None"}</span>
            </p>
            <button className="btn-primary" disabled={!selectedSeat} onClick={confirmSelection}>
              Confirm Booking
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

