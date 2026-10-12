"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type CashFlowPoint = {
  label: string;
  income: number;
  expenses: number;
};

export type CashFlowRange = "6months" | "12months" | "thisYear";

const RANGES: { value: CashFlowRange; label: string }[] = [
  { value: "6months", label: "6 mesiacov" },
  { value: "12months", label: "12 mesiacov" },
  { value: "thisYear", label: "Tento rok" },
];

const eur = (n: number) => `€${Math.round(n).toLocaleString("sk-SK")}`;

type CashFlowChartProps = {
  data: Record<CashFlowRange, CashFlowPoint[]>;
  defaultRange?: CashFlowRange;
  className?: string;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: CashFlowPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const { label, income, expenses } = payload[0].payload;

  return (
    <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 text-[11px] text-popover-foreground shadow-md">
      <div className="mb-0.5 font-medium">{label}</div>
      <div className="tabular-nums">Príjem: {eur(income)}</div>
      <div className="tabular-nums">Výdavky: {eur(expenses)}</div>
    </div>
  );
}

export function CashFlowChart({
  data,
  defaultRange = "6months",
  className,
}: CashFlowChartProps) {
  const [range, setRange] = useState<CashFlowRange>(defaultRange);
  const points = data[range] ?? [];

  const net = useMemo(
    () => points.reduce((sum, p) => sum + p.income - p.expenses, 0),
    [points],
  );

  const yMax = useMemo(
    () =>
      Math.max(0, ...points.map((p) => Math.max(p.income, p.expenses))) * 1.15,
    [points],
  );

  return (
    <Card className={cn("gap-0 rounded-xl p-5 shadow-none", className)}>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Príjmy a výdavky
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Prehľad mesačného cash-flow z nájmov a nákladov na údržbu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-4 text-xs sm:flex">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-primary" />
              <span className="text-muted-foreground">Príjmy (nájom)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-muted-foreground/40" />
              <span className="text-muted-foreground">Výdavky (údržba)</span>
            </div>
          </div>

          <div
            role="group"
            aria-label="Časové obdobie"
            className="flex items-center rounded-lg bg-muted p-0.5 text-xs"
          >
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                aria-pressed={range === r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  range === r.value
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-52 w-full">
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Pre vybrané obdobie nie sú dostupné údaje
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={points}
              margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
              barGap={4}
              barCategoryGap="25%"
            >
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                width={44}
                domain={[0, yMax]}
                tickLine={false}
                axisLine={false}
                tickCount={4}
                tickFormatter={(v: number) => eur(v)}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                hide={false}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.6 }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="income"
                fill="var(--primary)"
                radius={[2, 2, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="expenses"
                fill="var(--muted-foreground)"
                fillOpacity={0.4}
                radius={[2, 2, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Čistý zisk za sledované obdobie:{" "}
          <strong
            className={cn(
              "font-semibold tabular-nums",
              net >= 0 ? "text-success" : "text-destructive",
            )}
          >
            {net >= 0 ? "+" : "−"}
            {eur(Math.abs(net))}
          </strong>
        </span>
        <span className="text-[11px]">
          Údaje sú založené na evidovaných platbách a faktúrach
        </span>
      </div>
    </Card>
  );
}
