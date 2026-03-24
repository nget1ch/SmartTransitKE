import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="space-y-5">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Hello, {user?.name?.split(" ")[0] || "Traveler"}.</h1>
        <p className="mt-2 text-slate-600">Plan trips quickly, pick exact seats, and track all bookings here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900">Search New Trip</h2>
          <p className="mt-1 text-sm text-slate-600">Find available routes and departure times.</p>
          <Link className="btn-primary mt-4" to="/search">
            Search Trips
          </Link>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-slate-900">My Bookings</h2>
          <p className="mt-1 text-sm text-slate-600">Review seat numbers, payment status, and trip details.</p>
          <Link className="btn-secondary mt-4" to="/bookings">
            View Bookings
          </Link>
        </div>
      </div>
    </section>
  );
}

