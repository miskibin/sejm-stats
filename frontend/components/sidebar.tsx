"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();
  const isCollapsed = state === "collapsed";

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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
              {menuItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={index} className="py-1.5">
                    <SidebarMenuButton
                      className={cn(
                        "transition-all duration-200 w-full rounded-md",
                        active && "text-primary font-medium"
                      )}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2",
                          isCollapsed ? "justify-center" : "",
                          active
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
