"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FileText, Home, MessageSquare, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTRPC } from "~/trpc/react";
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
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: chats, isLoading: isLoadingChats } = useQuery(
    trpc.chat.getChats.queryOptions({ limit: 30 }),
  );

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
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
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

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupAction asChild title="New Chat">
            <Link href="/dashboard/chat">
              <Plus />
            </Link>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoadingChats &&
                Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}
              {chats?.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/dashboard/chat/${chat.id}`}
                  >
                    <Link href={`/dashboard/chat/${chat.id}`}>
                      <MessageSquare />
                      <span className="truncate">
                        {chat.title ?? "Untitled"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {!isLoadingChats && chats?.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground">
                      No chats yet
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
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
