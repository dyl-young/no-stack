"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function LayoutHeader({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-background",
        open && "mt-4 rounded-tl-2xl",
      )}
    >
      <div className={cn("sticky top-0 z-10 shrink-0 bg-transparent p-2.5")}>
        <SidebarTrigger />
      </div>
      {children}
    </div>
  );
}
