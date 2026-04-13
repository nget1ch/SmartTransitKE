import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * allowedRoles: string[] — e.g. ["ADMIN"] or ["OPERATOR", "ADMIN"]
 * If no allowedRoles, only requires authentication.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role; // role is returned as string from API
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === "ADMIN") return <Navigate to="/admin" replace />;
      if (userRole === "OPERATOR") return <Navigate to="/operator" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
