import { createContext, useContext, useMemo, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [search, setSearch] = useState({ origin: "", destination: "", date: "" });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [draftBooking, setDraftBooking] = useState(null); // created booking payload from API

  function resetFlow() {
    setSelectedTrip(null);
    setSelectedSeat(null);
    setDraftBooking(null);
  }

  const value = useMemo(
    () => ({
      search,
      setSearch,
      selectedTrip,
      setSelectedTrip,
      selectedSeat,
      setSelectedSeat,
      draftBooking,
      setDraftBooking,
      resetFlow,
    }),
    [search, selectedTrip, selectedSeat, draftBooking]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

