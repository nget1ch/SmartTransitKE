import { Badge } from "@/components/ui/badge";

const STATUS_MAP = {
  // Booking statuses
  CONFIRMED: { label: "Confirmed", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "secondary" },
  FAILED: { label: "Failed", variant: "destructive" },
  // Payment statuses
  SUCCESS: { label: "Paid", variant: "success" },
  PAID: { label: "Paid", variant: "success" },
  // Trip statuses
  SCHEDULED: { label: "Scheduled", variant: "info" },
  IN_TRANSIT: { label: "In Transit", variant: "warning" },
  COMPLETED: { label: "Completed", variant: "success" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { label: status || "Unknown", variant: "secondary" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
