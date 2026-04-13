import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ title, value, description, icon: Icon, trend, className }) {
  const isPositive = trend >= 0;
  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value ?? "—"}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
        {trend !== undefined && (
          <p className={cn("mt-1 text-xs font-medium", isPositive ? "text-emerald-600" : "text-red-500")}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
