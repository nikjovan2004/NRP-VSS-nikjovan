export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#e5e7eb] ${className}`}
    />
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="mt-2 h-3 w-48" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-5 w-24 rounded-full" />
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-56" />
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
    </div>
  );
}
