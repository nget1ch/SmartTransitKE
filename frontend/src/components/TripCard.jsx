import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  const { setSelectedTrip, setSelectedSeat } = useBooking();

  const availableSeats = typeof trip.availableSeats === "number" ? trip.availableSeats : trip.capacity;

  function handleSelectSeat() {
    setSelectedTrip(trip);
    setSelectedSeat(null);
    navigate(`/seats/${trip.id}`);
  }

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand-700">
            {trip.route?.origin} to {trip.route?.destination}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{formatDate(trip.departureTime)}</h3>
          <p className="mt-1 text-sm text-slate-500">Bus: {trip.bus?.plateNumber || "N/A"}</p>
        </div>
        <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm">
          <div>
            <span className="font-semibold text-slate-900">{availableSeats}</span> seats available
          </div>
          <div className="text-slate-500">Capacity: {trip.capacity || trip.bus?.capacity}</div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn-primary w-full sm:w-auto" onClick={handleSelectSeat} disabled={availableSeats <= 0}>
          {availableSeats > 0 ? "Select Seats" : "Fully Booked"}
        </button>
      </div>
    </article>
  );
}

