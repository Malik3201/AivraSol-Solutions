import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("bg-white/5", className)} />;
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <AdminSkeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
