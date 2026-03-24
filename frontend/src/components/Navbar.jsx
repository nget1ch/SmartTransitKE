import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useBooking } from "../context/BookingContext.jsx";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2 text-sm font-semibold transition ${
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { resetFlow } = useBooking();
  const navigate = useNavigate();

  function onLogout() {
    resetFlow();
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
            ST
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-900">SmartTransitKE</div>
            <div className="text-xs text-slate-500">Intercity bus bookings</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/search">Search</NavItem>
          <NavItem to="/trips">Trips</NavItem>
          {isAuthenticated ? (
            <>
              <NavItem to="/dashboard">Dashboard</NavItem>
              <NavItem to="/bookings">My Bookings</NavItem>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
              <button className="btn-secondary" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

