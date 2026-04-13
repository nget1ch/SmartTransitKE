import { useState } from "react";
import { Download } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import StatusBadge from "@/components/shared/StatusBadge";

export default function CustomerBookings() {
  const { bookings, loading, error, refetch } = useBookings();
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your trips and view payment receipts.</p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Your upcoming and past trips will appear here." />
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Departure Time</TableHead>
                <TableHead>Seat</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.trip?.route?.origin} → {booking.trip?.route?.destination}
                  </TableCell>
                  <TableCell>{new Date(booking.trip?.departureTime).toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline">#{booking.seatNumber}</Badge></TableCell>
                  <TableCell><StatusBadge status={booking.status} /></TableCell>
                  <TableCell>
                    <StatusBadge status={booking.payment?.status || "PENDING"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReceipt(booking)}>
                          Receipt
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Booking Receipt</DialogTitle>
                          <DialogDescription>ID: {booking.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex justify-between border-b pb-2">
                              <span className="text-muted-foreground">Route</span>
                              <span className="font-medium">{booking.trip?.route?.origin} to {booking.trip?.route?.destination}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                              <span className="text-muted-foreground">Departure</span>
                              <span className="font-medium">{new Date(booking.trip?.departureTime).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                              <span className="text-muted-foreground">Seat</span>
                              <span className="font-medium">#{booking.seatNumber}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                              <span className="text-muted-foreground">Payment Status</span>
                              <StatusBadge status={booking.payment?.status || "PENDING"} />
                            </div>
                            <div className="flex justify-between pt-2">
                              <span className="text-muted-foreground font-semibold">Total Paid</span>
                              <span className="font-bold text-lg">KES {Number(booking.payment?.amount || booking.trip?.route?.basePrice || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline">
                          <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
