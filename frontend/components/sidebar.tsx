"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { stat } from "fs";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type AppSidebarProps = {
  menuItems: MenuItem[];
};

export default function AppSidebar({ menuItems = [] }: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative p-4">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <div
              className={`relative flex-shrink-0 ${
                isCollapsed ? "w-8 h-8" : "w-10 h-10"
              }`}
            >
              <Image
                src="/logo.png"
                alt="Sejm Stats Logo"
                fill
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold">sejm-stats</span>
            )}
          </div>
        </Link>
        <button
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground lg:hidden"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index} className="py-1.5">
                  <SidebarMenuButton className="transition-all duration-200 w-full">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
