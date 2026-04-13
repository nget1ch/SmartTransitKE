import { useState } from "react";
import { Plus } from "lucide-react";
import { api, getApiErrorMessage } from "@/services/api";
import { useRoutes } from "@/hooks/useRoutes";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

export default function AdminRoutes() {
  const { toast } = useToast();
  const { routes, loading, error, refetch } = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ origin: "", destination: "", basePrice: "", distance: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/routes", {
        origin: form.origin,
        destination: form.destination,
        basePrice: parseFloat(form.basePrice || 0),
        distance: parseFloat(form.distance || 0),
      });
      toast({ variant: "success", title: "Route added", description: "New route has been created." });
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
          <h1 className="text-3xl font-bold">Routes Management</h1>
          <p className="text-muted-foreground">Configure destinations and origins.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Route</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Route</DialogTitle>
              <DialogDescription>Add a new origin and destination pair.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input value={form.origin} onChange={(e) => setForm({...form, origin: e.target.value})} placeholder="e.g. Nairobi" required />
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})} placeholder="e.g. Kisumu" required />
              </div>
              <div className="space-y-2">
                <Label>Base Price (KES)</Label>
                <Input type="number" value={form.basePrice} onChange={(e) => setForm({...form, basePrice: e.target.value})} placeholder="1500" required />
              </div>
              <Button type="submit" className="w-full">Save Route</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-32 w-full" /></div>
      ) : routes.length === 0 ? (
        <EmptyState title="No routes configured" description="Add your first travel route to begin operations." />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Base Price (KES)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map(route => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.origin}</TableCell>
                  <TableCell>{route.destination}</TableCell>
                  <TableCell>{Number(route.basePrice || 0).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
