"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import ConfirmPopup from "../confirm-popup";
import { useState, useTransition } from "react";
import { deleteProperty } from "@/app/actions/property-actions";
import { toast } from "sonner";

export default function DeletePropertyButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProperty(propertyId);

      // if error occurs, show error toast and close popup
      if (!result.success) {
        toast.error(result.error);
        setIsPopupOpen(false);
        return;
      }
      toast.success("Nehnuteľnosť bola úspešne zmazaná");
      setIsPopupOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="opacity-70 hover:opacity-100 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setIsPopupOpen(true);
        }}
      >
        <Trash className="size-4" />
      </Button>

      <ConfirmPopup
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        title="Ste si istý, že chcete odstrániť túto nehnuteľnosť?"
        description="Tato akcia je nevratná a odstráni aj všetky súvisiace údaje."
        variant="danger"
        confirmLabel="Ano, zmazať"
        cancelLabel="Zrušit"
        onConfirm={handleDelete}
        isLoading={isPending}
      />
    </>
  );
}
