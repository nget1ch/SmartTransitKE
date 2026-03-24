import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext.jsx";

export default function Search() {
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
    <section className="mx-auto w-full max-w-3xl">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Search Trips</h1>
        <p className="mt-1 text-sm text-slate-600">Choose your route and date to see available buses.</p>

        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="label">Origin</span>
            <input className="input" name="origin" value={form.origin} onChange={updateField} required />
          </label>
          <label className="space-y-1">
            <span className="label">Destination</span>
            <input className="input" name="destination" value={form.destination} onChange={updateField} required />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="label">Departure Date</span>
            <input className="input" type="date" name="date" value={form.date} onChange={updateField} required />
          </label>
          <button className="btn-primary sm:col-span-2" type="submit">
            Search Buses
          </button>
        </form>
      </div>
    </section>
  );
}

