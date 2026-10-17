import { AppHeader } from "@/components/app-header";
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
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Nový byt</h2>
          <p className="text-muted-foreground">
            Tu môžete pridať nový byt do svojho portfólia.
          </p>
        </div>
      </main>
    </div>
  );
}
