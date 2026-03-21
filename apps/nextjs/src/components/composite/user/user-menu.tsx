"use client";

import Link from "next/link";
import { ChevronUp, LogOut, User } from "lucide-react";

import { SignOutButtonSlim } from "@/components/composite/auth/sign-out-button";
import { UserAvatar } from "@/components/composite/user/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme";
import { UserDisplayName } from "./user-display-name";

export function UserMenu() {
  return (
    <DropdownMenu>
      <SidebarTrigger />
      <DropdownMenuContent align={"start"} className="w-64">
        {/* User info header */}
        <div className="flex items-center gap-3 p-2">
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-medium">
              <UserDisplayName />
            </p>
            <p className="truncate text-xs text-muted-foreground">
              <UserDisplayName preferEmail />
            </p>
          </div>
        </div>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/user/account"
            className="flex w-full items-center gap-2"
            replace
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        {/* Theme Toggle */}
        <DropdownMenuItem
          className="focus:bg-transparent"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </DropdownMenuItem>

        <Separator className="my-1" />

        {/* Sign Out */}
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <SignOutButtonSlim />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarTrigger() {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="group flex h-auto w-full justify-between p-1"
      >
        <div className="flex w-full items-center gap-2">
          <div className={"m-0 h-6 w-6 shrink-0"}>
            <UserAvatar />
          </div>
          <div className="flex w-full flex-row items-center justify-between truncate group-data-[collapsible=icon]:hidden">
            <UserDisplayName />
            <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:scale-y-[-1]" />
          </div>
        </div>
      </Button>
    </DropdownMenuTrigger>
  );
}
