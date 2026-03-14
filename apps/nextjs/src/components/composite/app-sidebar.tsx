"use client";

import Link from "next/link";
import { FileText, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemedLogo } from "./landing/themed-logo";
import { UserMenu } from "./user/user-menu";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "CRUD",
    url: "/dashboard/posts",
    icon: FileText,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar variant={open ? "inset" : "floating"} className="border-none">
      <SidebarContent>
        <SidebarHeader className="m-1 flex items-start justify-center">
          <Link href="/" className="relative h-6 w-6">
            <ThemedLogo />
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>no-stack</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu variant="sidebar" showAccount showTheme />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
