import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
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

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type AppSidebarProps = {
  menuItems: MenuItem[];
};

export function AppSidebar({ menuItems }: AppSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Sejm Stats Logo"
              width={40}
              height={40}
            />
          </div>
          <span
            className={`text-xl font-bold ${
              state === "collapsed" ? "hidden" : "block"
            }`}
          >
            sejm-stats
          </span>
        </div>
        <button
          className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-200"
          aria-label="Close sidebar"
        >
          <FaTimes size={20} />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`py-5 px-4 text-base  transition-all duration-200 ${
                      state === "collapsed" ? "justify-center" : ""
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3"
                    >
                      <span
                        className={`text-lg ${
                          state === "collapsed" ? "mx-auto" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={state === "collapsed" ? "hidden" : "block"}
                      >
                        {item.label}
                      </span>
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
