import Skeleton from "@/components/loading-skeleton";

export default function SidebarSkeleton() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r flex flex-col gap-4 p-4 shrink-0">
        {/* Logo / workspace */}
        <div className="flex items-center gap-2 px-2 py-1">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="size-4 rounded-sm" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          ))}
        </div>

        {/* Bottom user */}
        <div className="mt-auto flex items-center gap-3 px-2 py-2">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center px-6">
          <Skeleton className="h-5 w-36" />
        </div>
        {/* Body */}
        <div className="flex-1 p-6 flex flex-col gap-4">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </div>
  );
}
