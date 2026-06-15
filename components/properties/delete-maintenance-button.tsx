"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import ConfirmPopup from "../confirm-popup";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteMaintenance } from "@/app/actions/maintenance-actions";

export default function DeleteMaintenanceButton({
  maintenanceId,
}: {
  maintenanceId: string;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMaintenance(maintenanceId);

      // if error occurs, show error toast and close popup
      if (!result.success) {
        toast.error(result.error);
        setIsPopupOpen(false);
        return;
      }
      toast.success("Záznam o oprave bol úspešne vymazaný");
      setIsPopupOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setIsPopupOpen(true);
        }}
      >
        <X className="size-4" />
      </Button>

      <ConfirmPopup
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        title="Ste si istý, že chcete odstrániť tento záznam?"
        variant="danger"
        confirmLabel="Ano, zmazať"
        cancelLabel="Zrušit"
        onConfirm={handleDelete}
        isLoading={isPending}
      />
    </>
  );
}
