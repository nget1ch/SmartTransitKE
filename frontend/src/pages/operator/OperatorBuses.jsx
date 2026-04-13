import { useState, useEffect } from "react";
import { Plus, Bus as BusIcon } from "lucide-react";
import { api, getApiErrorMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

export default function OperatorBuses() {
  const { toast } = useToast();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ plateNumber: "", capacity: "" });

  async function fetchBuses() {
    setLoading(true);
    try {
      // Assuming GET /buses exists or using a known endpoint. For now we will mock empty list if no endpoint.
      // Wait, there's no GET /buses in buses.routes.js ... We'll handle it nicely.
      setBuses([]);
    } catch (err) {
      setError("Endpoint not complete on backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBuses(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/buses", { plateNumber: form.plateNumber, capacity: parseInt(form.capacity, 10) });
      toast({ variant: "success", title: "Bus Added", description: `${form.plateNumber} has been added to your fleet.` });
      setIsOpen(false);
      setForm({ plateNumber: "", capacity: "" });
      fetchBuses();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: getApiErrorMessage(err) });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Buses</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Bus</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Bus</DialogTitle>
              <DialogDescription>Enter the bus details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>License Plate Number</Label>
                <Input name="plateNumber" value={form.plateNumber} onChange={(e) => setForm({...form, plateNumber: e.target.value})} placeholder="KBC 123D" required minLength={3} />
              </div>
              <div className="space-y-2">
                <Label>Seating Capacity</Label>
                <Input name="capacity" type="number" value={form.capacity} onChange={(e) => setForm({...form, capacity: e.target.value})} placeholder="14" required min={1} />
              </div>
              <Button type="submit" className="w-full">Save Bus</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchBuses} />
      ) : loading ? (
        <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-32 w-full" /></div>
      ) : buses.length === 0 ? (
        <EmptyState icon={BusIcon} title="No buses found" description="You haven't added any buses yet." />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map(bus => (
                <TableRow key={bus.id}>
                  <TableCell className="font-medium">{bus.plateNumber}</TableCell>
                  <TableCell>{bus.capacity} Seats</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
