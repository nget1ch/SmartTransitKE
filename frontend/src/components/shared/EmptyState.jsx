import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

export default function EmptyState({ icon: Icon = PackageOpen, title = "Nothing here yet", description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 rounded-full bg-muted p-5">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} className="mt-4" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
