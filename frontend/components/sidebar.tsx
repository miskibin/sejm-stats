"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, X, ChevronDown } from "lucide-react";
import {
  FaUsers,
  FaVoteYea,
  FaCogs,
  FaAddressBook,
  FaPeopleCarry,
  FaHandshake,
  FaCommentDots,
  FaBook,
  FaChartBar,
  FaGithub,
} from "react-icons/fa";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    href: "/envoys",
    label: "Posłowie",
    icon: <FaUsers className="w-6 h-6" />,
  },
  {
    href: "/clubs",
    label: "Kluby parlamentarne",
    icon: <FaHandshake className="w-6 h-6" />,
  },
  {
    href: "/committees",
    label: "Komisje sejmowe",
    icon: <FaPeopleCarry className="w-6 h-6" />,
  },
  {
    href: "/legislative",
    label: "Legislacja",
    icon: <FaCogs className="w-6 h-6" />,
    submenu: [
      {
        href: "/votings",
        label: "Głosowania",
        icon: <FaVoteYea className="w-4 h-4" />,
      },
      {
        href: "/processes",
        label: "Procesy legislacyjne",
        icon: <FaCogs className="w-4 h-4" />,
      },
      {
        href: "/acts",
        label: "Dziennik ustaw",
        icon: <FaBook className="w-4 h-4" />,
      },
      {
        href: "/interpellations",
        label: "Interpelacje",
        icon: <FaCommentDots className="w-4 h-4" />,
      },
    ],
  },
  {
    href: "/about",
    label: "O projekcie",
    icon: <FaAddressBook className="w-6 h-6" />,
    submenu: [
      { href: "/faq", label: "FAQ", icon: <FaBook className="w-4 h-4" /> },
      {
        href: "https://github.com/miskibin/sejm-stats/issues/new/choose",
        label: "Zgłoś błąd",
        icon: <FaGithub className="w-4 h-4" />,
      },
      {
        href: "https://chat.sejm-stats.pl/",
        label: "Asystent prawny",
        icon: <ExternalLink className="w-4 h-4" />,
      },
    ],
  },
  {
    href: "/stats",
    label: "Statystyki",
    icon: <FaChartBar className="w-6 h-6" />,
  },
];

export default function AppSidebar() {
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
                    {item.submenu ? (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <div
                            className={cn(
                              "transition-all duration-200 w-full rounded-md cursor-pointer",
                              active && "text-primary font-medium"
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center gap-2 p-2",
                                isCollapsed ? "justify-center" : "",
                                active
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              <span className="text-lg">{item.icon}</span>
                              {!isCollapsed && (
                                <>
                                  <span>{item.label}</span>
                                  <ChevronDown className="ml-auto h-4 w-4" />
                                </>
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem, subIndex) => (
                              <SidebarMenuSubItem key={subIndex}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center gap-2",
                                      isActive(subItem.href)
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    <span className="text-sm">
                                      {subItem.icon}
                                    </span>
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <div
                        className={cn(
                          "transition-all duration-200 w-full rounded-md",
                          active && "text-primary font-medium"
                        )}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 p-2",
                            isCollapsed ? "justify-center" : "",
                            active
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      </div>
                    )}
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
