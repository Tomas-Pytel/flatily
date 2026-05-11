import { DashboardHeader } from "@/components/dashboard-header";
import IndicatorCard from "@/components/indicator-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockProperties } from "@/lib/mock-data";
import {
  Banknote,
  ArrowUpRight,
  Building2,
  Users,
  Wrench,
  Bell,
} from "lucide-react";

export default function DashboardPage() {
  const totalProperties = mockProperties.length;
  const occupancyRate = "92%"; // This would be calculated in a real app
  const totalMonthlyIncome = totalProperties * 550; // Mock calculation

  const stats = [
    {
      title: "Mesačný príjem",
      value: `${totalMonthlyIncome.toLocaleString("sk-SK")} €`,
      icon: Banknote,
      topRight: (
        <span className="text-xs text-green-500 flex items-center font-medium">
          <ArrowUpRight className="size-3 mr-1" /> +4.5%
        </span>
      ),
    },
    {
      title: "Nehnuteľnosti",
      value: totalProperties,
      icon: Building2,
    },
    {
      title: "Obsadenosť",
      value: occupancyRate,
      icon: Users,
    },
    {
      title: "Aktívne opravy",
      value: "3",
      icon: Wrench,
      topRight: (
        <span className="text-xs text-amber-500 font-medium">
          Vyžaduje pozornosť
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title="Prehľad" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* 1. Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <IndicatorCard key={index} indicator={stat} />
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. Recent Notifications / Alerts (Spans 2 columns on large screens) */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Dôležité upozornenia
            </h2>
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  <ActivityItem
                    title="Nájomné uhradené"
                    desc="Ján Novák (Bratislava) zaplatil nájom za Máj."
                    time="Pred 2 hodinami"
                    icon={Banknote}
                    iconColor="text-green-500"
                  />
                  <ActivityItem
                    title="Koniec zmluvy"
                    desc="Zmluva pre 'Garsónka blízko centra' končí o 30 dní."
                    time="Pred 5 hodinami"
                    icon={Bell}
                    iconColor="text-blue-500"
                  />
                  <ActivityItem
                    title="Nahlásená oprava"
                    desc="Kvapkajúci kohútik - Dunajská 3."
                    time="Včera"
                    icon={Wrench}
                    iconColor="text-amber-500"
                  />
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* 3. Quick Actions */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Rýchle akcie
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start gap-3 h-12">
                <Building2 className="size-4" /> Pridať nehnuteľnosť
              </Button>
              <Button variant="outline" className="justify-start gap-3 h-12">
                <Users className="size-4" /> Nový nájomca
              </Button>
              <Button variant="outline" className="justify-start gap-3 h-12">
                <Wrench className="size-4" /> Vytvoriť servisný lístok
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ActivityItem({ title, desc, time, icon: Icon, iconColor }: any) {
  return (
    <li className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
      <div className={`p-2 rounded-full bg-muted mt-0.5 ${iconColor}`}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <p className="text-[10px] text-muted-foreground uppercase font-bold">
          {time}
        </p>
      </div>
    </li>
  );
}
