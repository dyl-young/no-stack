import { cookies } from "next/headers";

import { AppSidebar } from "@/components/composite/app-sidebar";
import { LayoutHeader } from "@/components/composite/layout-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
      <AppSidebar />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <LayoutHeader>
          <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center overflow-y-auto py-4 pr-5 pl-4 sm:pr-8 sm:pl-6 md:pr-10 md:pl-8 lg:pr-12 lg:pl-10">
            {children}
          </div>
        </LayoutHeader>
      </main>
    </SidebarProvider>
  );
}
