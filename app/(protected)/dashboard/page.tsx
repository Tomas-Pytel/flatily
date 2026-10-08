import { AppHeader } from "@/components/app-header";
import {
  AttentionCard,
  AttentionCardProps,
} from "@/components/dashboard/attention-card";
import {
  CashFlowChart,
  CashFlowPoint,
  CashFlowRange,
} from "@/components/dashboard/cash-flow-chart";
import { KpiCard, KpiCardProps } from "@/components/dashboard/kpi-card";
import { MyProperties } from "@/components/dashboard/my-properties";
import { requireUser } from "@/lib/auth";
import {
  AlertCircle,
  Bell,
  Building,
  CheckCircle2,
  Clock4,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { ComponentProps } from "react";

export default async function DashboardPage() {
  const user = await requireUser();

  const kpiCards: KpiCardProps[] = [
    {
      title: "Mesačný príjem",
      value: "2450 €",
      subtitle: "za posledný mesiac",
      trend: {
        value: "+12%",
        isPositive: true,
      },
      statusColor: "success",
      icon: TrendingUp,
    },
    {
      title: "Obsadenost",
      value: "7/10",
      subtitle: "70% bytov obsadených",
      icon: Building,
    },
    {
      title: "Uhradené tento mesiac",
      value: "4440€",
      subtitle: "100% nájomného uhradené",
      icon: CheckCircle2,
    },
    {
      title: "Po splatnosti",
      value: "€ 0",
      subtitle: "0 neuhradené platby",
      icon: AlertCircle,
      statusColor: "warning",
    },
    {
      title: "Otvorené opravy",
      value: "4",
      subtitle: "Urgentné opravy",
      statusColor: "error",
      icon: Wrench,
    },
  ];

  const attentionCards: AttentionCardProps[] = [
    {
      tone: "error",
      badgeStatus: "destructive",
      badgeLabel: "Omeškaný nájom",
      meta: "5 dní po splatnosti",
      emphasizeMeta: true,
      title: "Ján Novák",
      subtitle: "Byt Košice - centrum (Hlavná 24)",
      amount: "€650",
      icon: AlertCircle,
      //description: "Platba za prenájom nie je uhradená včas.",
      action: {
        label: "Zobraziť platbu",
        href: "/payments/1",
      },
    },
    {
      tone: "warning",
      badgeStatus: "warning",
      badgeLabel: "Končiaca zmluva",
      meta: "o 18 dní (24.10.)",
      emphasizeMeta: true,
      title: "Jana Svobodová",
      subtitle: "Byt Bratislava - centrum (Námestie SNP 5)",
      icon: Clock4,
      description:
        "Zmluva končí o 18 dní. Pripravený dodatok na predĺženie nájmu.",
      action: {
        label: "Zobraziť zmluvu",
        href: "/payments/2",
      },
    },
    {
      tone: "error",
      badgeStatus: "destructive",
      badgeLabel: "Urgentná oprava",
      meta: "Nahlásené pred 1 dňom",
      emphasizeMeta: false,
      title: "Pokazený bojler",
      subtitle: "Byt Košice - centrum (Hlavná 24)",
      icon: AlertCircle,
      description:
        "Nájomník nemá teplú vodu. Dohodnutý havarijný servis na dnes 14:00.",
      action: {
        label: "Zobraziť opravu",
        href: "/payments/1",
      },
    },
    {
      tone: "error",
      badgeStatus: "destructive",
      badgeLabel: "Urgentná oprava",
      meta: "Nahlásené pred 1 dňom",
      emphasizeMeta: false,
      title: "Pokazený bojler",
      subtitle: "Byt Košice - centrum (Hlavná 24)",
      icon: AlertCircle,
      description:
        "Nájomník nemá teplú vodu. Dohodnutý havarijný servis na dnes 14:00.",
      action: {
        label: "Zobraziť opravu",
        href: "/payments/1",
      },
    },
  ];

  const last12: CashFlowPoint[] = [
    { label: "Nov", income: 6400, expenses: 1150 },
    { label: "Dec", income: 6400, expenses: 2300 },
    { label: "Jan", income: 6550, expenses: 1800 },
    { label: "Feb", income: 6550, expenses: 950 },
    { label: "Mar", income: 6700, expenses: 2650 },
    { label: "Apr", income: 6700, expenses: 1200 },
    { label: "máj", income: 6850, expenses: 1450 },
    { label: "Jún", income: 6850, expenses: 3100 },
    { label: "Júl", income: 7000, expenses: 1050 },
    { label: "Aug", income: 6350, expenses: 1900 },
    { label: "Sep", income: 7000, expenses: 1350 },
    { label: "Okt", income: 7000, expenses: 2200 },
  ];

  const cashFlowMock: Record<CashFlowRange, CashFlowPoint[]> = {
    "6months": last12.slice(-6),
    "12months": last12,
    // Jan–Oct 2026
    thisYear: last12.slice(2),
  };

  type Props = ComponentProps<typeof MyProperties>;
  const mockApartments: Props["apartments"] = [
    {
      id: "apt-1",
      name: "Byt Košice – Centrum",
      city: "Košice",
      district: "Centrum",
      photoUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      status: "obsadeny",
      rentAmount: 650,
      area: 62,
      rooms: 3,
      currentTenantId: "ten-1",
    },
    {
      id: "apt-2",
      name: "Byt Bratislava – Ružinov",
      city: "Bratislava",
      district: "Ružinov",
      photoUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      status: "konci_coskoro",
      rentAmount: 820,
      area: 54,
      rooms: 2,
      currentTenantId: "ten-2",
    },
    {
      id: "apt-3",
      name: "Byt Košice – Sever",
      city: "Košice",
      district: "Sever",
      photoUrl: null, // tests the "Žiadny obrázok" fallback
      status: "urgent",
      rentAmount: 480,
      area: 38,
      rooms: 1,
      currentTenantId: "ten-3",
    },
    {
      id: "apt-4",
      name: "Byt Prešov – Sídlisko III",
      city: "Prešov",
      district: "Sídlisko III",
      photoUrl:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      status: "volny",
      rentAmount: 420,
      area: 45,
      rooms: 2,
      currentTenantId: null, // vacant -> "Voľný byt"
    },
    {
      id: "apt-5",
      name: "Byt Žilina – Vlčince",
      city: "Žilina",
      district: "Vlčince",
      photoUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      status: "obsadeny",
      rentAmount: 550,
      area: 58,
      rooms: 3,
      currentTenantId: "ten-4",
    },
  ];
  const mockPeriod = "Október 2026";
  const mockTenants: Props["tenants"] = [
    { id: "ten-1", firstName: "Ján", lastName: "Novák" },
    { id: "ten-2", firstName: "Petra", lastName: "Horváthová" },
    { id: "ten-3", firstName: "Martin", lastName: "Kováčik" },
    { id: "ten-4", firstName: "Zuzana", lastName: "Hrubá-Podolinská" }, // long name, tests truncation
  ];

  const mockPayments: Props["payments"] = [
    { apartmentId: "apt-1", period: mockPeriod, status: "Uhradené" },
    { apartmentId: "apt-2", period: mockPeriod, status: "Omeškané" },
    { apartmentId: "apt-3", period: mockPeriod, status: "Čaká" },
    // apt-4: no payment -> "Bez platby"
    {
      apartmentId: "apt-5",
      period: "September 2026",
      status: "Uhradené",
    }, // other period, ignored
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <AppHeader
        title="Prehľad"
        subtitle="Tu máte prehľad o svojich bytoch a nájmoch."
        primaryAction={{
          label: "Pridať nehnuteľnosť",
          href: "/properties/new",
        }}
      >
        <Bell className="size-4 text-muted-foreground/70" />
      </AppHeader>

      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:gap-8 lg:p-8 *:shrink-0">
        {/** KPI Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiCards.map((card, index) => (
            <KpiCard key={index} {...card} />
          ))}
        </section>

        {/** Attention Needed */}
        {/* <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {attentionCards.map((card, index) => (
            <AttentionCard key={index} {...card} />
          ))}
        </section> */}
        <section>
          <div className="mb-3.5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Vyžaduje vašu pozornosť
              </h3>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium tabular-nums text-destructive">
                {attentionCards.length} úlohy
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Zoradené podľa naliehavosti
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
            {attentionCards.map((card, index) => (
              <AttentionCard key={index} {...card} />
            ))}
          </div>
        </section>

        {/** Cash Flow Chart */}
        <section>
          <CashFlowChart data={cashFlowMock} />
        </section>

        {/**My Properties */}
        <MyProperties
          apartments={mockApartments}
          tenants={mockTenants}
          payments={mockPayments}
          period={mockPeriod}
          //limit={limit}
          //allHref={allHref}
          // className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        />
      </main>
    </div>
  );
}
