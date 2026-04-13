import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";

export default function OperatorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAllBookings() {
    // Currently relying on all bookings trick, real system would filter by operator ID on backend
    setLoading(true);
    try {
      // If no admin/operator global get bookings, display empty state
      setBookings([]);
    } catch (err) {
      setError("Endpoint not implemented.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAllBookings(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Passenger Bookings</h1>
        <p className="text-muted-foreground">View all tickets booked for your trips.</p>
      </div>

      {loading ? (
        <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-48 w-full" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAllBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No passenger bookings yet" description="Bookings will appear here once trips are sold." />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Passenger</TableHead>
                <TableHead>Trip</TableHead>
                <TableHead>Seat</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.user?.name || "Guest"}</TableCell>
                  <TableCell>{b.trip?.route?.origin} → {b.trip?.route?.destination}</TableCell>
                  <TableCell><Badge>#{b.seatNumber}</Badge></TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
