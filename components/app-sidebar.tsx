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
  HelpCircle,
  LogOut,
  Settings,
  UserCircle,
  Building2,
  Lock,
  LucideIcon,
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

interface SidebarUser {
  name: string;
  email: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: SidebarUser;
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number | null;
}

// This is sample data.
const platformNav: NavItem[] = [
  { title: "Prehľad", icon: LayoutDashboard, badge: null, url: "/dashboard" },
  { title: "Moje nehnuteľnosti", icon: Building2, url: "/properties" },
];

const settingsNav: NavItem[] = [
  { title: "Nastavenia", icon: Settings, url: "/settings" },
  { title: "Notifikácie", icon: Bell, url: "/notifications" },
  { title: "Bezpečnosť", icon: Lock, url: "/security" },
];

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

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-1 py-1">
              {/* Logo – hidden when collapsed */}
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <Image
                      src={Logo}
                      alt="Flatily Logo"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="truncate font-semibold text-lg">
                    Flatily
                  </span>
                </Link>
              </SidebarMenuButton>

              {/* Collapse / expand button */}
              <SidebarTrigger className="ml-auto shrink-0" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Platform group */}
        <SidebarGroup>
          <SidebarGroupLabel>Platforma</SidebarGroupLabel>
          <SidebarMenu>
            {platformNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isLinkActive(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings group */}
        <SidebarGroup>
          <SidebarGroupLabel>Nastavenia</SidebarGroupLabel>
          <SidebarMenu>
            {settingsNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isLinkActive(item.url)}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Help (pushed to bottom) */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs text-sidebar-foreground/70">
                <span>Vzhľad</span>
                <ThemeSwitcher />
              </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Pomoc & Podpora">
                <Link href="#">
                  <HelpCircle />
                  <span>Pomoc &amp; Podpora</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
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
