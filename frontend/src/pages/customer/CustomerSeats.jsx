import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, getApiErrorMessage } from "@/services/api";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

export default function CustomerSeats() {
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
          api.get(`/trips/${tripId}/availability`, { params: { includeSeats: "true", availableLimit: 200 } }),
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

  const capacity = useMemo(() => availability?.capacity || selectedTrip?.capacity || selectedTrip?.bus?.capacity || 0, [availability, selectedTrip]);
  const bookedSeats = availability?.bookedSeats || [];

  if (error) return <ErrorState message={error} />;
  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-96 w-full" /></div>;

  const totalRows = Math.ceil(capacity / 4);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Seat Selection</h1>
          <p className="text-muted-foreground">Select your preferred seat for the journey.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/trips">Back to Trips</Link>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto border-t-4 border-t-primary">
        <CardContent className="p-6">
          <div className="mb-8 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-emerald-100 ring-1 ring-emerald-300" /> Available</div>
            <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-primary text-primary-foreground" /> Selected</div>
            <div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-slate-200 text-slate-400" /> Booked</div>
          </div>

          <div className="mx-auto flex flex-col gap-4 rounded-3xl border-4 border-slate-200 bg-slate-50 p-6 shadow-inner w-max dark:border-slate-800 dark:bg-slate-900">
            {/* Driver section */}
            <div className="mb-4 flex justify-end px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-slate-200 text-xs font-bold text-slate-500">
                DRV
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-[auto_3rem_auto] gap-x-8 gap-y-3">
              {[...Array(totalRows)].map((_, rowIndex) => (
                <div key={rowIndex} className="col-span-3 grid grid-cols-[auto_3rem_auto] gap-x-8">
                  <div className="flex gap-3">
                    {[1, 2].map((colIndex) => {
                      const num = rowIndex * 4 + colIndex;
                      if (num > capacity) return <div key={num} className="h-12 w-12" />;
                      return <SeatButton key={num} num={num} booked={bookedSeats.includes(num)} selected={selectedSeat === num} onClick={() => setSelectedSeat(num)} />;
                    })}
                  </div>
                  <div className="h-12 border-l border-r border-slate-200 border-dashed dark:border-slate-700"></div> {/* Aisle */}
                  <div className="flex gap-3">
                    {[3, 4].map((colIndex) => {
                      const num = rowIndex * 4 + colIndex;
                      if (num > capacity) return <div key={num} className="h-12 w-12" />;
                      return <SeatButton key={num} num={num} booked={bookedSeats.includes(num)} selected={selectedSeat === num} onClick={() => setSelectedSeat(num)} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <span className="text-muted-foreground">Selected Seat: </span>
              <span className="text-lg font-bold">{selectedSeat || "--"}</span>
            </div>
            <Button disabled={!selectedSeat} onClick={() => navigate("/confirm")} className="mt-4 sm:mt-0 px-8">
              Continue to Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SeatButton({ num, booked, selected, onClick }) {
  return (
    <button
      disabled={booked}
      onClick={onClick}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-t-xl rounded-b-sm font-semibold transition-all shadow-sm ring-inset ring-1",
        booked ? "bg-slate-200 text-slate-400 ring-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 dark:ring-slate-700" :
        selected ? "bg-primary text-primary-foreground ring-primary scale-105" :
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-800"
      )}
    >
      {num}
    </button>
  );
}
