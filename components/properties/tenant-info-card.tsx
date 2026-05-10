import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

type PaymentStatus = "Uhradené" | "Čakaújce" | "Omeškané";

export interface TenantInfoCardProps {
  name: string;
  leaseEndDate: string;
  paymentStatus: PaymentStatus;
  deposit: number;
  phone: string;
  email: string;
  image?: string;
}

export default function TenantInfoCard({
  name,
  leaseEndDate,
  paymentStatus,
  deposit,
  phone,
  email,
  image,
}: TenantInfoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center border-b">
        <div className="relative h-16 w-16 rounded-xl overflow-hidden mb-4">
          <Image
            src={image || "/placeholder-avatar.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium text-center">{name}</h3>
          <p className="text-sm text-muted-foreground text-center">
            Nájomná zmluva končí: {leaseEndDate}
          </p>
        </div>
        <div className="flex gap-2">
          {/**mail */}
          <button className="size-8 bg-muted flex items-center justify-center">
            <Mail className="size-4 mr-1" />
          </button>
          {/**phone */}
          <button className="size-8 bg-muted flex items-center justify-center">
            <Phone className="size-4 mr-1" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="py-4 flex flex-col justify-center items-center gap-1">
          <p className="text-muted-foreground text-center">STATUS PLATBY</p>
          <p
            className={
              paymentStatus === "Uhradené"
                ? "text-green-500"
                : paymentStatus === "Čakaújce"
                  ? "text-yellow-500"
                  : "text-red-500"
            }
          >
            {paymentStatus}
          </p>
        </div>
        <div className="py-4 flex flex-col justify-center items-center gap-1">
          <p className="text-muted-foreground text-center">ZÁLOHY</p>
          <p className="text-2xl font-bold">{deposit.toFixed(2)} €</p>
        </div>
      </CardContent>
    </Card>
  );
}
