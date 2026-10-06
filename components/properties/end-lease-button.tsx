"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import ConfirmPopup from "../confirm-popup";
import { endLease } from "@/app/actions/lease-actions";

export default function EndLeaseButton({ leaseId }: { leaseId: string }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEnd = () => {
    startTransition(async () => {
      const result = await endLease(leaseId);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Zmluva bola ukončená");
      }
      setIsPopupOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 text-muted-foreground hover:text-destructive cursor-pointer"
        onClick={() => setIsPopupOpen(true)}
      >
        Ukončiť zmluvu
      </Button>

      <ConfirmPopup
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        title="Ukončiť nájomnú zmluvu?"
        description="Zmluva sa ukončí k dnešnému dňu, budúce neuhradené predpisy nájmu sa zmažú a nehnuteľnosť sa uvoľní pre nového nájomcu."
        variant="warning"
        confirmLabel="Áno, ukončiť"
        cancelLabel="Zrušiť"
        onConfirm={handleEnd}
        isLoading={isPending}
      />
    </>
  );
}
