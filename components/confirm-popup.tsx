"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";

type ConfirmPopupVariant = "default" | "warning" | "danger";

export interface ConfirmPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmPopupVariant;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
}

export default function ConfirmPopup({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Potvrdiť",
  cancelLabel = "Zrušiť",
  variant = "default",
  onConfirm,
  isLoading = false,
}: ConfirmPopupProps) {
  const variantStyles: Record<ConfirmPopupVariant, string> = {
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 ",
    warning:
      "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400 ",
    default: "bg-primary hover:bg-primary/90 text-primary-foreground ",
  };

  const iconMap: Record<ConfirmPopupVariant, React.ReactNode> = {
    danger: (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
    ),
    warning: (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
      </div>
    ),
    default: null,
  };
  return (
    <Dialog open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-4">
          {iconMap[variant]}
          <div className="space-y-1.5">
            <DialogTitle className="text-lg font-semibold leading-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-2 flex-row justify-end gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-none cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 sm:flex-none cursor-pointer ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Spracováva sa…
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
