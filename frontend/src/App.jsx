import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Public Pages
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard.jsx";
import CustomerSearch from "./pages/customer/CustomerSearch.jsx";
import CustomerTrips from "./pages/customer/CustomerTrips.jsx";
import CustomerSeats from "./pages/customer/CustomerSeats.jsx";
import CustomerConfirm from "./pages/customer/CustomerConfirm.jsx";
import CustomerBookings from "./pages/customer/CustomerBookings.jsx";

// Operator Pages
import OperatorDashboard from "./pages/operator/OperatorDashboard.jsx";
import OperatorBuses from "./pages/operator/OperatorBuses.jsx";
import OperatorTrips from "./pages/operator/OperatorTrips.jsx";
import OperatorBookings from "./pages/operator/OperatorBookings.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRoutes from "./pages/admin/AdminRoutes.jsx";
import AdminTrips from "./pages/admin/AdminTrips.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminLogs from "./pages/admin/AdminLogs.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes (CUSTOMER) */}
      <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]}><AppShell /></ProtectedRoute>}>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/search" element={<CustomerSearch />} />
        <Route path="/trips" element={<CustomerTrips />} />
        <Route path="/seats/:tripId" element={<CustomerSeats />} />
        <Route path="/confirm" element={<CustomerConfirm />} />
        <Route path="/bookings" element={<CustomerBookings />} />
      </Route>

      {/* Operator Routes */}
      <Route element={<ProtectedRoute allowedRoles={["OPERATOR"]}><AppShell /></ProtectedRoute>}>
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/operator/buses" element={<OperatorBuses />} />
        <Route path="/operator/trips" element={<OperatorTrips />} />
        <Route path="/operator/bookings" element={<OperatorBookings />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]}><AppShell /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/routes" element={<AdminRoutes />} />
        <Route path="/admin/trips" element={<AdminTrips />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
