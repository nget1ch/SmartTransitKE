import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Bus, Route, CalendarDays, BookOpen, Users, BarChart3,
  ChevronLeft, ChevronRight, LogOut, Settings, ClipboardList, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = {
  ADMIN: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Routes", href: "/admin/routes", icon: Route },
    { label: "Trips", href: "/admin/trips", icon: CalendarDays },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Logs", href: "/admin/logs", icon: ClipboardList },
  ],
  OPERATOR: [
    { label: "Overview", href: "/operator", icon: LayoutDashboard, exact: true },
    { label: "My Buses", href: "/operator/buses", icon: Bus },
    { label: "Trips", href: "/operator/trips", icon: CalendarDays },
    { label: "Bookings", href: "/operator/bookings", icon: BookOpen },
  ],
  CUSTOMER: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Search Trips", href: "/search", icon: MapPin },
    { label: "My Bookings", href: "/bookings", icon: BookOpen },
  ],
};

const ROLE_COLORS = {
  ADMIN: "bg-rose-500/20 text-rose-400",
  OPERATOR: "bg-amber-500/20 text-amber-400",
  CUSTOMER: "bg-blue-500/20 text-blue-400",
};

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role || "CUSTOMER";
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.CUSTOMER;

  function isActive(item) {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Brand */}
        <div className={cn("flex h-16 items-center border-b border-sidebar-border px-3", collapsed ? "justify-center" : "justify-between px-4")}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bus className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-sidebar-foreground">SmartTransit</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bus className="h-4 w-4 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn("h-7 w-7 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", collapsed && "mt-0")}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-3">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map((item) => {
              const active = isActive(item);
              const navLink = (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return navLink;
            })}
          </nav>
        </ScrollArea>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="mb-2 rounded-md bg-sidebar-accent px-3 py-2">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
              <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", ROLE_COLORS[role])}>
                {role}
              </span>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "sm"}
                onClick={handleLogout}
                className={cn("w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-red-400", !collapsed && "justify-start gap-2")}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && "Sign Out"}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
