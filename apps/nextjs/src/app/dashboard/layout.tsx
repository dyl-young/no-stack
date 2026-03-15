import { cookies } from "next/headers";

import { AppSidebar } from "@/components/composite/app-sidebar";
import { LayoutHeader } from "@/components/composite/layout-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
      <AppSidebar />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <LayoutHeader>
          <div className="flex w-full mx-auto max-w-7xl flex-1 justify-center overflow-y-auto py-4 pl-4 pr-5 sm:pl-6 sm:pr-8 md:pl-8 md:pr-10 lg:pl-10 lg:pr-12">
            {children}
          </div>
        </LayoutHeader>
      </main>
    </SidebarProvider >
  );
}
