import {
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import DeleteMaintenanceButton from "./delete-maintenance-button";
import MaintenanceFormDialog from "./new-maintenance-form";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { MaintenanceStatus } from "@/lib/generated/prisma/enums";

export interface RepairLog {
  maintenanceId: string;
  resolvedDate?: Date;
  title: string;
  provider: string;
  cost: number;
  status: MaintenanceStatus;
  description?: string;
}

interface RepairHistoryTableProps {
  repairs: RepairLog[];
  propertyId: string;
}

export default function RepairHistoryTable({
  propertyId,
  repairs,
}: RepairHistoryTableProps) {
  if (repairs.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground italic text-sm">
        Zatiaľ neboli evidované žiadne opravy.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-muted/40">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-25">Dátum</TableHead>
            <TableHead>Typ práce</TableHead>
            <TableHead>Poskytovateľ</TableHead>
            <TableHead className="text-right whitespace-nowrap">
              Náklady
            </TableHead>
            <TableHead className="w-12" />
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.map((repair) => (
            <TableRow
              key={repair.maintenanceId}
              className="group hover:bg-muted/30"
            >
              <TableCell className="text-muted-foreground text-xs">
                {repair.resolvedDate?.toLocaleDateString("sk-SK")}
              </TableCell>
              <TableCell className="font-medium">{repair.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {repair.provider}
              </TableCell>
              <TableCell className="text-right font-semibold whitespace-nowrap">
                {repair.cost.toLocaleString("sk-SK", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </TableCell>
              <TableCell>
                <MaintenanceFormDialog
                  propertyId={propertyId}
                  initialValues={repair}
                  triggerButton={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-blue-500 cursor-pointer"
                    >
                      <Pencil className="size-4" />
                    </Button>
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                <DeleteMaintenanceButton maintenanceId={repair.maintenanceId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
