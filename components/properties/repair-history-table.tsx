import {
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { RepairLog } from "@/types/property";

export interface RepairHistoryTableProps {
  repairs: RepairLog[];
}

export default function RepairHistoryTable({
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.map((repair) => (
            <TableRow key={repair.id} className="group hover:bg-muted/30">
              <TableCell className="text-muted-foreground text-xs">
                {repair.date}
              </TableCell>
              <TableCell className="font-medium">{repair.workType}</TableCell>
              <TableCell className="text-muted-foreground">
                {repair.provider}
              </TableCell>
              <TableCell className="text-right font-semibold whitespace-nowrap">
                {repair.cost.toLocaleString("sk-SK", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
