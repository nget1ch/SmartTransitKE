import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { api, getApiErrorMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CustomerConfirm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedTrip, selectedSeat, clearBooking } = useBooking();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!selectedTrip || !selectedSeat) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">No trip selected</h2>
        <p className="mt-2 text-muted-foreground">Please select a trip and seat before proceeding to confirmation.</p>
        <Button asChild className="mt-6"><Link to="/search">Search Trips</Link></Button>
      </div>
    );
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      await api.post("/bookings", { tripId: selectedTrip.id, seatNumber: selectedSeat });
      toast({ variant: "success", title: "Booking successful", description: "Your seat has been reserved." });
      clearBooking();
      navigate("/bookings");
    } catch (err) {
      toast({ variant: "destructive", title: "Booking failed", description: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  const price = Number(selectedTrip.route?.basePrice || 0);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Review Booking</h1>
          <p className="text-sm text-muted-foreground">Confirm your trip details before payment.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle>Journey Details</CardTitle>
          <CardDescription>Verify your travel information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-semibold">{selectedTrip.route?.origin}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-semibold">{selectedTrip.route?.destination}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Departure</p>
              <p className="font-medium">{new Date(selectedTrip.departureTime).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bus Plate</p>
              <p className="font-medium">{selectedTrip.bus?.registrationNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seat Number</p>
              <div className="inline-flex items-center justify-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                {selectedSeat}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Passenger</p>
              <p className="font-medium truncate">{user?.name}</p>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span>KES {price.toLocaleString()}</span>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button className="w-full" size="lg" onClick={handleConfirm} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Book</>}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By confirming, you agree to our Terms of Service and cancellation policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
