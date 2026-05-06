import AppSidebar from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbSeparator,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
