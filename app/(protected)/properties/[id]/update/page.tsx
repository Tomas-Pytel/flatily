import { getPropertyDetail, updateProperty } from "@/app/actions/properties";
import { AppHeader } from "@/components/common/app-header";
import { PropertyForm } from "@/components/properties/property-form";
import { Bell } from "lucide-react";
import { notFound } from "next/navigation";

interface UpdatePropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdatePropertyPage({
  params,
}: UpdatePropertyPageProps) {
  const { id } = await params;
  const response = await getPropertyDetail(id);

  if (!response.success) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Upraviť nehnuteľnosť"
        subtitle="Upravte údaje o nehnuteľnosti."
      >
        <Bell className="size-4 text-muted-foreground" />
      </AppHeader>
      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8">
        <PropertyForm
          property={response.data}
          cancelHref={`/properties/${id}`}
          action={updateProperty.bind(null, id)}
        />
      </main>
    </div>
  );
}
