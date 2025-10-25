"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IconDashboard, IconMessage, IconMessages, IconUsers } from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isActive = (prefix: string) => {
    return pathname ? pathname.startsWith(prefix) : false;
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard" className="flex items-center">
                <span className="text-base font-semibold">BCC SMS Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <a href="/dashboard">
                <IconDashboard className="!size-4" />
                <span>Overview</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/sms/single")}>
              <a href="/sms/single">
                <IconMessage className="!size-4" />
                <span>Single Send</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/sms/bulk")}>
              <a href="/sms/bulk">
                <IconMessages className="!size-4" />
                <span>Bulk Send</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin")}>
              <a href="/admin/users">
                <IconUsers className="!size-4" />
                <span>Users</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-3">
          <a href="/dashboard" className="flex items-center justify-start">
            <Image
              src="/BAIUST_Comp_Club_Logo_Black.png"
              alt="BAIUST Computer Club Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
