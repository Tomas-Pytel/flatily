import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ChargeActions from "./charge-actions";
import type { ChargeView } from "@/lib/rent-charges";

export interface ChargeRow {
  id: string;
  period: Date;
  dueDate: Date;
  amount: number;
  paid: number;
  view: ChargeView;
}

const VIEW_META: Record<ChargeView, { label: string; className: string }> = {
  PAID: {
    label: "Uhradené",
    className: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900",
  },
  PARTIAL: {
    label: "Čiastočne",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900",
  },
  PENDING: {
    label: "Čakajúce",
    className: "bg-muted text-muted-foreground",
  },
  OVERDUE: {
    label: "Omeškané",
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
  },
};

const money = (n: number) =>
  `${n.toLocaleString("sk-SK", { minimumFractionDigits: 2 })} €`;

export default function RentChargesCard({ charges }: { charges: ChargeRow[] }) {
  if (charges.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground italic text-sm">
        Nehnuteľnosť nemá aktívnu zmluvu, nie sú žiadne predpisy nájmu.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-muted/40">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Obdobie</TableHead>
              <TableHead>Splatnosť</TableHead>
              <TableHead className="text-right">Suma</TableHead>
              <TableHead className="text-right">Uhradené</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {charges.map((c) => {
              const meta = VIEW_META[c.view];
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium capitalize">
                    {c.period.toLocaleDateString("sk-SK", {
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {c.dueDate.toLocaleDateString("sk-SK", { timeZone: "UTC" })}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {money(c.amount)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {money(c.paid)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${meta.className} font-semibold text-[11px] px-2 py-0`}
                    >
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ChargeActions chargeId={c.id} isPaid={c.view === "PAID"} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
