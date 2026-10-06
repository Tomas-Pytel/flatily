"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { markChargePaid, undoChargePayments } from "@/app/actions/payment-actions";

export default function ChargeActions({
  chargeId,
  isPaid,
}: {
  chargeId: string;
  isPaid: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const run = () =>
    startTransition(async () => {
      const result = isPaid
        ? await undoChargePayments(chargeId)
        : await markChargePaid(chargeId);

      if (!result.success) toast.error(result.error);
      else toast.success(isPaid ? "Úhrada bola zrušená" : "Nájom bol označený ako uhradený");
    });

  return (
    <Button
      variant={isPaid ? "ghost" : "outline"}
      size="sm"
      className="cursor-pointer text-xs"
      disabled={isPending}
      onClick={run}
    >
      {isPaid ? "Zrušiť úhradu" : "Označiť uhradené"}
    </Button>
  );
}
