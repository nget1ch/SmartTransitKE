import EmptyState from "@/components/shared/EmptyState";
import { Users } from "lucide-react";

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View operators, passengers, and admins.</p>
      </div>

      {/* Backend doesn't have a getUsers endpoint yet, show a graceful empty state */}
      <EmptyState 
        icon={Users}
        title="Admin Users API Pending" 
        description="The backend endpoint for fetching users is currently under development." 
      />
    </div>
  );
}
