import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import NewPropertyForm from "@/components/properties/new-property-form";
import Link from "next/link";

export default function NewPropertyPage() {
  return (
    <div className="flex h-full flex-col bg-muted/20">
      <DashboardHeader title="Nová nehnuteľnosť">
        <Button variant="outline" size="sm" asChild>
          <Link href="/properties">Späť</Link>
        </Button>
      </DashboardHeader>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center">
        <NewPropertyForm />
      </main>
    </div>
  );
}
