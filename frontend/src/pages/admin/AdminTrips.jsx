import { useTrips } from "@/hooks/useTrips";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";

export default function AdminTrips() {
  const { trips, loading, error, refetch } = useTrips();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All System Trips</h1>
        <p className="text-muted-foreground">View and monitor all trips across all operators.</p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>
      ) : trips.length === 0 ? (
        <EmptyState title="No trips scheduled" description="No trips have been added to the system." />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Bus</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map(trip => (
                <TableRow key={trip.id}>
                  <TableCell className="font-mono text-xs">{trip.id.slice(-6)}</TableCell>
                  <TableCell className="font-medium">{trip.route?.origin} → {trip.route?.destination}</TableCell>
                  <TableCell>{new Date(trip.departureTime).toLocaleString()}</TableCell>
                  <TableCell>{trip.bus?.registrationNumber}</TableCell>
                  <TableCell><StatusBadge status={trip.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
