"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/favicon.ico";
import {
  Bell,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Building2,
  LucideIcon,
  Users,
  Wrench,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "./theme-switcher";
import { cn } from "@/lib/utils";

interface SidebarUser {
  name: string;
  email: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SidebarUser;
  counts?: {
    apartments: number;
    urgentRepairs: number;
    unreadNotifs: number;
  };
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number | null;
  alertCount?: number | null;
  alertType?: "danger" | "primary";
}

/**
 * Nav button look (design reference: Sidebar.tsx).
 * All colours come from the --sidebar-* tokens in globals.css, so light/dark
 * is handled by the theme and no `dark:` variants are needed here.
 */
const navButtonClass = cn(
  "h-auto gap-3 rounded-lg px-3 font-medium transition-all [&>svg]:size-4.5",
  // Icons: muted -> foreground on hover -> same colour as the label when active
  "[&>svg]:text-sidebar-foreground/60",
  "not-data-[active=true]:hover:[&>svg]:text-sidebar-accent-foreground",
  "data-[active=true]:[&>svg]:text-sidebar-primary-foreground",
  // Active = solid primary, and it stays that way on hover / press
  "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
  "data-[active=true]:hover:bg-sidebar-primary data-[active=true]:hover:text-sidebar-primary-foreground",
  "data-[active=true]:active:bg-sidebar-primary data-[active=true]:active:text-sidebar-primary-foreground",
  // Collapsed rail (4.5rem): icon-only, centred 40px square (label hidden explicitly)
  "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden",
);

const groupLabelClass =
  "h-7 px-3 text-[11px] tracking-wider text-sidebar-foreground/60 group-data-[collapsible=icon]:-mt-7";

type BadgeTone = "count" | "danger" | "primary";

// Pill colours per tone. The peer-* overrides replace shadcn's default
// hover/active badge colours so the pill stays readable on the active (primary) button.
const badgeToneClass: Record<BadgeTone, string> = {
  count: cn(
    "bg-muted text-muted-foreground peer-hover/menu-button:text-muted-foreground",
    "peer-data-[active=true]/menu-button:bg-sidebar-primary-foreground/20 peer-data-[active=true]/menu-button:text-sidebar-primary-foreground",
    "peer-data-[active=true]/menu-button:peer-hover/menu-button:text-sidebar-primary-foreground",
  ),
  danger: cn(
    "bg-destructive px-1.5 font-bold text-destructive-foreground",
    "peer-hover/menu-button:text-destructive-foreground peer-data-[active=true]/menu-button:text-destructive-foreground",
  ),
  primary: cn(
    "bg-sidebar-primary px-1.5 font-bold text-sidebar-primary-foreground",
    "peer-hover/menu-button:text-sidebar-primary-foreground",
    "peer-data-[active=true]/menu-button:bg-sidebar-primary-foreground peer-data-[active=true]/menu-button:text-sidebar-primary",
    "peer-data-[active=true]/menu-button:peer-hover/menu-button:text-sidebar-primary",
  ),
};

function NavMenuItem({
  item,
  isActive,
  compact = false,
}: {
  item: NavItem;
  isActive: boolean;
  compact?: boolean;
}) {
  const value = item.badge ?? item.alertCount ?? null;
  const tone: BadgeTone =
    item.badge != null ? "count" : (item.alertType ?? "danger");

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActive}
        className={cn(
          navButtonClass,
          compact ? "py-2" : "py-2.5 data-[active=true]:shadow-xs",
        )}
      >
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>

      {value != null && (
        <>
          <SidebarMenuBadge
            className={cn(
              "right-3 rounded-full px-2",
              compact
                ? "peer-data-[size=default]/menu-button:top-2"
                : "peer-data-[size=default]/menu-button:top-2.5",
              badgeToneClass[tone],
            )}
          >
            {value}
          </SidebarMenuBadge>

          {/* Collapsed rail: shadcn hides badges, so alerts fall back to a dot */}
          {tone !== "count" && (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-1 right-2 hidden size-2 rounded-full ring-2 ring-sidebar group-data-[collapsible=icon]:block",
                tone === "danger" ? "bg-destructive" : "bg-sidebar-primary",
              )}
            />
          )}
        </>
      )}
    </SidebarMenuItem>
  );
}

export default function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLinkActive = (url: string) =>
    pathname === url || pathname.startsWith(`${url}/`);
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const apartmentsCount = props.counts?.apartments || 12;
  const urgentRepairsCount = props.counts?.urgentRepairs || 2;
  const unreadNotifsCount = props.counts?.unreadNotifs || 5;

  const platformNav: NavItem[] = [
    { title: "Prehľad", icon: LayoutDashboard, badge: null, url: "/dashboard" },
    {
      title: "Byty",
      icon: Building2,
      url: "/properties",
      badge: apartmentsCount,
    },
    { title: "Nájomníci", icon: Users, url: "/leases" },
    { title: "Platby", icon: CreditCard, url: "/payments" },
    {
      title: "Opravy",
      icon: Wrench,
      url: "/maintenance",
      alertCount: urgentRepairsCount > 0 ? urgentRepairsCount : null,
      alertType: "danger",
    },
    { title: "Dokumenty", icon: FileText, url: "/documents" },
  ];

  const settingsNav: NavItem[] = [
    {
      title: "Notifikácie",
      icon: Bell,
      url: "/notifications",
      alertCount: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      alertType: "primary",
    },
    { title: "Nastavenia", icon: Settings, url: "/settings" },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border select-none z-20"
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="relative h-16 justify-center border-b border-sidebar-border px-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-1 py-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
              {/* Logo – wordmark hidden when collapsed */}
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-transparent"
              >
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <Image
                      src={Logo}
                      alt="Flatily Logo"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="flex items-baseline gap-1 group-data-[collapsible=icon]:hidden">
                    <span className="text-lg font-bold tracking-tight text-foreground">
                      Flatily
                    </span>
                    <span
                      aria-hidden
                      className="mb-1 size-1.5 rounded-full bg-accent"
                    />
                  </span>
                </Link>
              </SidebarMenuButton>

              {/* Collapse / expand button */}
              <SidebarTrigger
                className={cn(
                  "ml-auto shrink-0 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent hover:cursor-pointer",
                  // Collapsed: float on the right edge, half outside the sidebar
                  "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-1/2 group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:z-20 group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:translate-x-full group-data-[collapsible=icon]:-translate-y-1/2 group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:border group-data-[collapsible=icon]:border-sidebar-border group-data-[collapsible=icon]:bg-sidebar group-data-[collapsible=icon]:shadow-xs",
                )}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Platform group */}
        <SidebarGroup className="gap-1 p-3">
          <SidebarGroupLabel className={groupLabelClass}>
            SPRÁVA
          </SidebarGroupLabel>
          <SidebarMenu>
            {platformNav.map((item) => (
              <NavMenuItem
                key={item.title}
                item={item}
                isActive={isLinkActive(item.url)}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings group */}
        <SidebarGroup className="gap-1 border-t border-sidebar-border/60 p-3 pt-2">
          <SidebarGroupLabel className={groupLabelClass}>
            SYSTÉM
          </SidebarGroupLabel>
          <SidebarMenu>
            {settingsNav.map((item) => (
              <NavMenuItem
                key={item.title}
                item={item}
                isActive={isLinkActive(item.url)}
                compact
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Help (pushed to bottom) */}
        <SidebarGroup className="mt-auto p-3">
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between px-3 py-1.5 text-xs text-sidebar-foreground/70">
                <span>Vzhľad</span>
                <ThemeSwitcher />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-auto rounded-lg bg-muted/50 p-2 group-data-[collapsible=icon]:mx-auto data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/15 text-xs font-semibold text-sidebar-primary dark:bg-sidebar-primary/20 hover:cursor-pointer">
                    {initials}
                  </div>
                  <div className="grid min-w-0 flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-semibold text-foreground">
                      {user.name}
                    </span>
                    <span className="truncate text-[11px] text-sidebar-foreground/60">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {/** Dropdown menu items */}
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-48"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="mr-2 size-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 size-4" />
                  Nastavenia
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  Odhlásiť sa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
