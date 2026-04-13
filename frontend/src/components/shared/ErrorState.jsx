import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 rounded-full bg-destructive/10 p-5">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold">Error</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-4" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}
