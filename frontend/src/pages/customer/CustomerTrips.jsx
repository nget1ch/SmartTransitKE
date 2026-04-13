import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, MapPin, Users } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useTrips } from "@/hooks/useTrips";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

function matchesDate(dateValue, tripDateValue) {
  if (!dateValue) return true;
  const tripDate = new Date(tripDateValue);
  if (Number.isNaN(tripDate.getTime())) return true;
  return tripDate.toISOString().slice(0, 10) === dateValue;
}

export default function CustomerTrips() {
  const location = useLocation();
  const { search } = useBooking();
  const activeSearch = location.state?.fromSearch || search;
  const { trips, loading, error, refetch } = useTrips();

  const filtered = useMemo(() => {
    return trips.filter((t) =>
      (!activeSearch?.origin || t.route?.origin?.toLowerCase() === activeSearch.origin.toLowerCase()) &&
      (!activeSearch?.destination || t.route?.destination?.toLowerCase() === activeSearch.destination.toLowerCase()) &&
      matchesDate(activeSearch?.date, t.departureTime)
    );
  }, [trips, activeSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trip Results</h1>
          <p className="text-muted-foreground">
            {activeSearch?.origin || "Anywhere"} → {activeSearch?.destination || "Anywhere"}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/search">Edit Search</Link>
        </Button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No trips found" description="Try adjusting your dates or routes." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trip) => (
            <Card key={trip.id} className="overflow-hidden flex flex-col transition-shadow hover:shadow-md">
              <div className="bg-primary/5 px-4 py-3 border-b flex justify-between items-center">
                <Badge variant={trip.status === "SCHEDULED" ? "default" : "secondary"}>{trip.status}</Badge>
                <div className="text-sm font-bold">KES {Number(trip.route?.basePrice || 0).toLocaleString()}</div>
              </div>
              <CardContent className="flex-1 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> From
                    </div>
                    <div className="font-semibold">{trip.route?.origin}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                      To <MapPin className="h-4 w-4" />
                    </div>
                    <div className="font-semibold">{trip.route?.destination}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(trip.departureTime).toLocaleString()}</div>
                  <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {trip.bus?.capacity} Seats</div>
                </div>

                <div className="mt-auto pt-2">
                  <Button asChild className="w-full" disabled={trip.status !== "SCHEDULED"}>
                    <Link to={`/seats/${trip.id}`}>Select Seats</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
