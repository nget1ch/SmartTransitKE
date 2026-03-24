import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import TripCard from "../components/TripCard.jsx";
import { useBooking } from "../context/BookingContext.jsx";
import { api, getApiErrorMessage } from "../services/api.js";

function matchesDate(dateValue, tripDateValue) {
  if (!dateValue) return true;
  const tripDate = new Date(tripDateValue);
  if (Number.isNaN(tripDate.getTime())) return true;
  const normalized = tripDate.toISOString().slice(0, 10);
  return normalized === dateValue;
}

export default function Trips() {
  const location = useLocation();
  const { search, setSearch } = useBooking();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trips, setTrips] = useState([]);

  const activeSearch = location.state?.fromSearch || search;

  useEffect(() => {
    async function fetchTrips() {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (activeSearch?.origin) params.origin = activeSearch.origin;
        if (activeSearch?.destination) params.destination = activeSearch.destination;
        const res = await api.get("/trips", { params });
        setTrips(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [activeSearch]);

  useEffect(() => {
    if (location.state?.fromSearch) setSearch(location.state.fromSearch);
  }, [location.state, setSearch]);

  const filtered = useMemo(
    () =>
      trips.filter(
        (t) =>
          (!activeSearch?.origin || t.route?.origin?.toLowerCase() === activeSearch.origin.toLowerCase()) &&
          (!activeSearch?.destination || t.route?.destination?.toLowerCase() === activeSearch.destination.toLowerCase()) &&
          matchesDate(activeSearch?.date, t.departureTime)
      ),
    [trips, activeSearch]
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trip Results</h1>
          <p className="text-sm text-slate-600">
            {activeSearch?.origin || "Any origin"} to {activeSearch?.destination || "any destination"}
          </p>
        </div>
        <Link className="btn-secondary" to="/search">
          Edit Search
        </Link>
      </div>

      {loading ? <Loader label="Finding available trips..." /> : null}
      {error ? <Alert type="error" title="Could not load trips" message={error} /> : null}

      {!loading && !error && filtered.length === 0 ? (
        <Alert
          type="info"
          title="No trips found"
          message="Try another date or route combination. You can also clear filters from Search."
        />
      ) : null}

      <div className="grid gap-4">
        {filtered.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  );
}

