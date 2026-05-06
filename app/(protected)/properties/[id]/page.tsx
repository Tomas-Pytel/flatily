import { Suspense } from "react";
import { mockProperties } from "../page";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function PropertyDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === Number(id));

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div>
      <h1>Property Details for ID: {id}</h1>
      <p>Title: {property.title}</p>
      <p>Description: {property.description}</p>
      <p>City: {property.city}</p>
      <p>Street: {property.street}</p>
      <p>Postal Code: {property.postalCode}</p>
    </div>
  );
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <div className="flex border-b p-5 gap-2 items-center">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-semibold tracking-tight ">
          Detail nehnuteľnosti
        </h1>
      </div>
      <div className="p-5">
        <Suspense fallback={<div>Loading property details...</div>}>
          <PropertyDetails params={params} />
        </Suspense>
      </div>
    </div>
  );
}
