import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Prehľad" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          Content
        </div>
      </main>
    </div>
  );
}
