import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b p-5 gap-2 items-center">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-2xl font-semibold tracking-tight ">Prehľad</h1>
      </div>

      <div className="p-5">Content</div>
    </div>
  );
}
