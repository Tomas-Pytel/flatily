import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/lib/auth";
import { Suspense } from "react";
import SidebarSkeleton from "@/components/sidebar-skeleton";

async function SidebarWithUser() {
  const user = await requireUser();
  const fallbackName = user.email ? user.email.split("@")[0] : "Používateľ";
  const sidebarUser = {
    name: fallbackName,
    email: user.email ?? "",
  };
  return <AppSidebar user={sidebarUser} />;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarWithUser />
      </Suspense>
      <SidebarInset>
        {/* Page content */}
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
