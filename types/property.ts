<<<<<<< HEAD
import { LucideIcon } from "lucide-react";

=======
>>>>>>> b157315 (Refactored types and deletion of unused components)
export type PaymentStatus = "Uhradené" | "Čakajúce" | "Omeškané";
export type PropertyStatus = "Aktívne" | "Neaktívne" | "V údržbe";

export interface Property {
  id: number;
  title: string;
  description?: string;
  city: string;
  street: string;
  postalCode: string;
  img?: string;
}

export interface DocumentInfo {
  id: string;
  title: string;
  date: string;
  size: string;
<<<<<<< HEAD
  icon: LucideIcon;
=======
  icon: React.ElementType;
>>>>>>> b157315 (Refactored types and deletion of unused components)
}

export interface RepairLog {
  id: number;
  date: string;
  workType: string;
  provider: string;
  cost: number;
}
