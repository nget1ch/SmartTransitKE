import { useState } from "react";
import { Plus } from "lucide-react";
import { api, getApiErrorMessage } from "@/services/api";
import { useTrips } from "@/hooks/useTrips";
import { useRoutes } from "@/hooks/useRoutes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";

export default function OperatorTrips() {
  const { trips, loading, error, refetch } = useTrips();
  const { routes } = useRoutes();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ routeId: "", busId: "", departureTime: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/trips", { 
        routeId: form.routeId, 
        busId: form.busId, 
        departureTime: new Date(form.departureTime).toISOString() 
      });
      toast({ variant: "success", title: "Trip created", description: "The trip is now available for booking." });
      setIsOpen(false);
      refetch();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: getApiErrorMessage(err) });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trip Management</h1>
          <p className="text-muted-foreground">Schedule new trips and monitor active journeys.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Trip</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Trip</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Route</Label>
                <Select value={form.routeId} onValueChange={(val) => setForm({...form, routeId: val})} required>
                  <SelectTrigger><SelectValue placeholder="Select a route" /></SelectTrigger>
                  <SelectContent>
                    {routes.map(r => <SelectItem key={r.id} value={r.id}>{r.origin} → {r.destination}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bus ID</Label>
                <Input value={form.busId} onChange={(e) => setForm({...form, busId: e.target.value})} placeholder="Bus ID" required />
              </div>
              <div className="space-y-2">
                <Label>Departure Time</Label>
                <Input type="datetime-local" value={form.departureTime} onChange={(e) => setForm({...form, departureTime: e.target.value})} required />
              </div>
              <Button type="submit" className="w-full">Publish Trip</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-32 w-full" /></div>
      ) : trips.length === 0 ? (
        <EmptyState title="No scheduled trips" description="Create a new trip to start receiving bookings." />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Bus</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map(trip => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.route?.origin} → {trip.route?.destination}</TableCell>
                  <TableCell>{trip.bus?.registrationNumber || '-'}</TableCell>
                  <TableCell>{new Date(trip.departureTime).toLocaleString()}</TableCell>
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
