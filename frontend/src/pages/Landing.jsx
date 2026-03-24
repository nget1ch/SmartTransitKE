import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

export default function Landing() {
  const navigate = useNavigate();
  const { setSearch } = useBooking();
  const [form, setForm] = useState({ origin: "", destination: "", date: "" });

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
    <section className="space-y-6">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-100">Travel Kenya with confidence</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Book intercity buses in minutes</h1>
          <p className="mt-3 max-w-2xl text-sm text-brand-50 sm:text-base">
            Compare schedules, choose your seat, and manage bookings in one clean flow.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1">
            <span className="label">Origin</span>
            <input className="input" name="origin" value={form.origin} onChange={updateField} placeholder="Nairobi" required />
          </label>
          <label className="space-y-1">
            <span className="label">Destination</span>
            <input
              className="input"
              name="destination"
              value={form.destination}
              onChange={updateField}
              placeholder="Mombasa"
              required
            />
          </label>
          <label className="space-y-1">
            <span className="label">Departure Date</span>
            <input className="input" type="date" name="date" value={form.date} onChange={updateField} required />
          </label>
          <div className="flex items-end">
            <button className="btn-primary w-full" type="submit">
              Search Buses
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

