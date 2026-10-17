"use client";

import { useState } from "react";

import { deleteProperty } from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeletePropertyDialogProps = {
  propertyId: string;
  propertyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function DeletePropertyDialog({
  propertyId,
  propertyName,
  open,
  onOpenChange,
  onDeleted,
}: DeletePropertyDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteProperty(propertyId);
      onOpenChange(false);
      onDeleted();
    } catch (deleteError) {
      console.error("Failed to delete property:", deleteError);
      setError("Nehnuteľnosť sa nepodarilo zmazať. Skúste to znova.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && isDeleting) return;
    if (nextOpen) setError(null);
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmazať nehnuteľnosť?</DialogTitle>
          <DialogDescription>
            Naozaj chcete zmazať byt &quot;{propertyName}&quot;? Akciu nie je
            možné vrátiť späť.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Zrušiť
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Maže sa..." : "Zmazať"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
