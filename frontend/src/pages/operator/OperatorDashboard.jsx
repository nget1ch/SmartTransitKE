import { useBookings } from "@/hooks/useBookings";
import { Bus, Users, MapPin, CalendarDays } from "lucide-react";
import StatCard from "@/components/shared/StatCard";

export default function OperatorDashboard() {
  const { bookings } = useBookings();
  
  // Calculate quick stats (this would normally come from an analytics endpoint)
  const totalBookings = bookings.length;
  // Deduplicate trips to find active ones
  const activeTrips = new Set(bookings.map(b => b.tripId)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Operator Overview</h1>
        <p className="text-muted-foreground">Manage your buses, trips, and view performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Buses" value="-" icon={Bus} description="Registered in fleet" />
        <StatCard title="Active Trips" value={activeTrips} icon={CalendarDays} description="Trips with bookings" />
        <StatCard title="Total Bookings" value={totalBookings} icon={Users} description="All-time passenger bookings" />
        <StatCard title="Popular Route" value="-" icon={MapPin} description="Top performing route" />
      </div>
    </div>
  );
}
