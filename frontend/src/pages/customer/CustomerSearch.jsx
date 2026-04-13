import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CustomerSearch() {
  const navigate = useNavigate();
  const { search, setSearch } = useBooking();
  const [form, setForm] = useState(search || { origin: "", destination: "", date: "" });

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    setSearch(form);
    navigate("/trips", { state: { fromSearch: form } });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Trips</h1>
        <p className="text-muted-foreground">Find the best routes available for your journey.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travel Details</CardTitle>
          <CardDescription>Enter your starting point and destination.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="origin" name="origin" value={form.origin} onChange={updateField} placeholder="e.g. Nairobi" required className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="destination" name="destination" value={form.destination} onChange={updateField} placeholder="e.g. Mombasa" required className="pl-9" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Departure Date (Optional)</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" id="date" name="date" value={form.date} onChange={updateField} className="pl-9" />
              </div>
            </div>

            <Button type="submit" className="w-full">Search Available Buses</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
