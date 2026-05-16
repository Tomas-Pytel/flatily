import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { PaymentStatus } from "@/types/property";

export interface TenantInfo {
  id: string;
  name: string;
  leaseEndDate: string;
  paymentStatus: PaymentStatus;
  deposit: number;
  phone: string;
  email: string;
  image?: string;
}

interface TenantInfoCardProps {
  tenant: TenantInfo;
}

export default function TenantInfoCard({ tenant }: TenantInfoCardProps) {
  const { name, leaseEndDate, paymentStatus, deposit, image } = tenant;

  const getStatusVariant = (status: PaymentStatus) => {
    switch (status) {
      case "Uhradené":
        return "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900";
      case "Čakajúce":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900";
      case "Omeškané":
        return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col items-center pt-6 pb-2">
        <div className="relative h-20 w-20 rounded-full border-4 border-background shadow-sm overflow-hidden mb-3">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-bold uppercase">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold leading-none">{name}</h3>
          <p className="text-xs text-muted-foreground italic">
            Nájomná zmluva končí: {leaseEndDate}
          </p>
        </div>

        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="icon" className="size-8 rounded-full">
            <Mail className="size-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="size-8 rounded-full">
            <Phone className="size-3.5" />
          </Button>
        </div>
      </CardHeader>

      {/**Payment status & Deposit */}
      <CardContent className="grid grid-cols-2 gap-4 border-t bg-muted/20 p-4">
        <div className="flex flex-col items-center justify-center gap-1 border-r">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Status platby
          </span>
          <Badge
            variant="outline"
            className={`${getStatusVariant(paymentStatus)} font-semibold text-[11px] px-2 py-0`}
          >
            {paymentStatus}
          </Badge>
        </div>
        <div className="flex flex-col items-center justify-center gap-0">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Zálohy
          </span>
          <span className="text-sm font-bold">{deposit.toFixed(2)} €</span>
        </div>
      </CardContent>
    </Card>
  );
}
