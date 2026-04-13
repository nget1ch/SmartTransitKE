import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "@/context/BookingContext";
import { MapPin, CalendarDays, Bus, ShieldCheck, Zap, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

  const features = [
    { icon: Zap, title: "Instant Booking", description: "Search, select, and pay in less than 2 minutes." },
    { icon: ShieldCheck, title: "Secure Payments", description: "Direct M-Pesa integration with KRA compliance." },
    { icon: Repeat, title: "Manage Trips", description: "Cancel or view your past and upcoming journeys easily." },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Navbar for Landing */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bus className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartTransit</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 px-4 py-24 text-center sm:py-32 dark:bg-background dark:border-b">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent"></div>
          
          <div className="container-page relative z-10 max-w-4xl">
            <h1 className="animate-fade-in text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Kenya's Premier <span className="text-primary">Bus Booking</span> Platform
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Reliable intercity travel at your fingertips. Compare routes, pick your exact seat, and pay securely via M-Pesa.
            </p>

            {/* Search Widget */}
            <Card className="mx-auto mt-12 max-w-4xl p-2 shadow-2xl dark:bg-card/90 dark:backdrop-blur">
              <form onSubmit={submit} className="flex flex-col gap-2 p-2 sm:flex-row sm:items-end">
                <div className="flex-1 space-y-1 text-left">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input name="origin" value={form.origin} onChange={updateField} placeholder="Nairobi" required className="pl-10 h-12" />
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-left">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input name="destination" value={form.destination} onChange={updateField} placeholder="Mombasa" required className="pl-10 h-12" />
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-left">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Date</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input type="date" name="date" value={form.date} onChange={updateField} required className="pl-10 h-12" />
                  </div>
                </div>
                <Button type="submit" size="lg" className="h-12 w-full sm:w-auto mt-4 sm:mt-0 px-8 text-base">
                  Search Buses
                </Button>
              </form>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="container-page py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why choose SmartTransit?</h2>
            <p className="mt-4 text-muted-foreground">Everything you need for a comfortable journey across Kenya.</p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={i} className="border-none shadow-none bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/50 py-8">
        <div className="container-page text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartTransitKE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
