import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Bus, CalendarCheck, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">What would you like to do today?</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Book a Trip
            </CardTitle>
            <CardDescription>Search for available buses and grab your seat.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/search">Find Trips</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              My Bookings
            </CardTitle>
            <CardDescription>View your past bookings and upcoming travel details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/bookings">View Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
