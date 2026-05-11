import { LucideIcon } from "lucide-react";

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
  icon: LucideIcon;
}

export interface RepairLog {
  id: number;
  date: string;
  workType: string;
  provider: string;
  cost: number;
}
