"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const DeletePropertyDialog = dynamic(
  () =>
    import("@/components/properties/delete-property-dialog").then(
      (module) => module.DeletePropertyDialog,
    ),
  { ssr: false },
);

export function DeletePropertyButton({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-[#DC2626] dark:hover:bg-neutral-800 dark:hover:text-[#EF4444] hover:cursor-pointer"
        title="Zmazať"
        aria-label={`Zmazať nehnuteľnosť ${propertyName}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {isDialogOpen && (
        <DeletePropertyDialog
          propertyId={propertyId}
          propertyName={propertyName}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onDeleted={() => router.refresh()}
        />
      )}
    </>
  );
}
