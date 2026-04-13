import { useEffect, useState } from "react";
import { Users, Banknote, CalendarDays, Bus, Activity } from "lucide-react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/shared/StatCard";

// Fallback empty analytics until real data is available
const DEFAULT_STATS = {
  totalUsers: 0,
  activeTrips: 0,
  revenue: 0,
  bookings: 0
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/analytics/stats");
        if (res.data) setStats(res.data);
      } catch (err) {
        // Fallback gracefully since stats might not be fully populated
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide metrics and performance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend={5} />
        <StatCard title="Revenue (KES)" value={stats.revenue.toLocaleString()} icon={Banknote} trend={12} />
        <StatCard title="Total Bookings" value={stats.bookings} icon={Activity} />
        <StatCard title="Active Trips" value={stats.activeTrips} icon={Bus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            Chart integration placeholder (recharts)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
