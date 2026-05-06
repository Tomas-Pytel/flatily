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
  BarChart2,
  Bell,
  ChevronsUpDown,
  LayoutDashboard,
  HelpCircle,
  LogOut,
  Package,
  Receipt,
  Settings,
  UserCircle,
  Users,
  Lock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

// This is sample data.
const platformNav = [
  { title: "Dashboard", icon: LayoutDashboard, badge: null, url: "#" },
  { title: "Analytics", icon: BarChart2, badge: "New", url: "#" },
  { title: "Customers", icon: Users, badge: null, url: "#" },
  { title: "Products", icon: Package, badge: null, url: "#" },
  { title: "Orders", icon: Receipt, badge: "12", url: "#" },
];

const settingsNav = [
  { title: "Settings", icon: Settings, url: "#" },
  { title: "Notifications", icon: Bell, url: "#" },
  { title: "Security", icon: Lock, url: "#" },
];

const user = {
  name: "Jane Doe",
  email: "jane@acme.com",
  initials: "JD",
};

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-1 py-1">
              {/* Logo – hidden when collapsed */}
              <SidebarMenuButton size="lg" asChild>
                <Link href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <Image
                      src={Logo}
                      alt="Rentio Logo"
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="truncate font-semibold text-lg">Rentio</span>
                </Link>
              </SidebarMenuButton>

              {/* Collapse / expand button */}
              <SidebarTrigger className="ml-auto shrink-0" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator />
      {/* Content */}
      <SidebarContent>
        {/* Platform group */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {platformNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
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
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            {settingsNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Help & Support">
                <Link href="#">
                  <HelpCircle />
                  <span>Help &amp; Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer – user switcher */}
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
                    {user.initials}
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

              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-48"
              >
                <DropdownMenuItem>
                  <UserCircle className="mr-2 size-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
