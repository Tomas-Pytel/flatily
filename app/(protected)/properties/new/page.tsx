import { AppHeader } from "@/components/app-header";
import { NewPropertyForm } from "@/components/properties/new-property-form";
import { Bell } from "lucide-react";

export default function NewPropertyPage() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Pridať nový byt"
        subtitle="Tu môžete pridať nový byt do svojho portfólia."
      >
        <Bell className="size-4 text-muted-foreground" />
      </AppHeader>
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8">
        <NewPropertyForm />
      </main>
    </div>
  );
}
