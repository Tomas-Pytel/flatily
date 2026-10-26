"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  className,
}: {
  propertyId: string;
  propertyName: string;
  className?: string;
}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className={cn(
          "cursor-pointer text-neutral-400 hover:bg-neutral-100 hover:text-[#DC2626] dark:hover:bg-neutral-800 dark:hover:text-[#EF4444]",
          className,
        )}
        title="Zmazať"
        aria-label={`Zmazať nehnuteľnosť ${propertyName}`}
      >
        <Trash2 className="size-4" />
      </Button>
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
