import {
  TableCell,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export interface RepairLog {
  id: number;
  date: string;
  workType: string;
  provider: string;
  cost: number;
}

export interface RepairHistoryTableProps {
  repairs: RepairLog[];
}

export default function RepairHistoryTable({
  repairs,
}: RepairHistoryTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dátum</TableHead>
            <TableHead>Typ práce</TableHead>
            <TableHead>Poskytovateľ</TableHead>
            <TableHead>Náklady</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.map((repair) => (
            <TableRow key={repair.id}>
              <TableCell>{repair.date}</TableCell>
              <TableCell className="font-semibold">{repair.workType}</TableCell>
              <TableCell>{repair.provider}</TableCell>
              <TableCell>{repair.cost} €</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
