"use client";

import Link from "next/link";
import { FileText, Home, MessageSquare } from "lucide-react";

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
import { AnimatedCubeLogo } from "./animated-cube-logo";
import { UserMenu } from "./user/user-menu";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageSquare,
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
    <Sidebar
      variant={open ? "inset" : "floating"}
      className="border-none"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarHeader className="mx-auto flex items-start justify-center">
          <Link href="/">
            <AnimatedCubeLogo
              size={32}
              animateFaces={["top", "left", "right"]}
              className="mt-[1px] text-primary"
            />
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
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
