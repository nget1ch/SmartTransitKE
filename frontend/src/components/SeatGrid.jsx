export default function SeatGrid({ capacity = 0, bookedSeats = [], selectedSeat, onSelectSeat }) {
  const booked = new Set(bookedSeats || []);
  const seats = Array.from({ length: capacity }, (_, idx) => idx + 1);

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
      {seats.map((seatNumber) => {
        const isBooked = booked.has(seatNumber);
        const isSelected = selectedSeat === seatNumber;

        return (
          <button
            key={seatNumber}
            type="button"
            disabled={isBooked}
            onClick={() => onSelectSeat(seatNumber)}
            className={`rounded-lg border px-2 py-3 text-sm font-semibold transition ${
              isBooked
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                : isSelected
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50"
            }`}
          >
            {seatNumber}
          </button>
        );
      })}
    </div>
  );
}

