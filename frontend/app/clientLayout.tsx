"use client";
import { ThemeProvider } from "@/components/theme-provider";
import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import {
  FaHome,
  FaUsers,
  FaVoteYea,
  FaCogs,
  FaPeopleCarry,
  FaHandshake,
  FaCommentDots,
  FaBook,
  FaBars,
  FaHeart,
  FaYoutube,
  FaDiscord,
  FaGithub,
  FaAddressBook,
  FaChartBar,
} from "react-icons/fa";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Breadcrumbs from "@/components/breadcrumbs";
import { SessionProvider } from "next-auth/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { ExternalLink } from "lucide-react";

type ClientLayoutProps = {
  children: ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  const menuItems = [
    {
      href: "/envoys",
      label: "Posłowie",
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      href: "/votings",
      label: "Głosowania",
      icon: <FaVoteYea className="w-6 h-6" />,
    },
    {
      href: "/processes",
      label: "Procesy legislacyjne",
      icon: <FaCogs className="w-6 h-6" />,
    },
    {
      href: "/faq",
      label: "O projekcie",
      icon: <FaAddressBook className="w-6 h-6" />,
    },
    {
      href: "/committees",
      label: "Komisje sejmowe",
      icon: <FaPeopleCarry className="w-6 h-6" />,
    },
    {
      href: "/clubs",
      label: "Kluby parlamentarne",
      icon: <FaHandshake className="w-6 h-6" />,
    },
    {
      href: "/interpellations",
      label: "Interpelacje",
      icon: <FaCommentDots className="w-6 h-6" />,
    },
    {
      href: "/acts",
      label: "Dziennik ustaw",
      icon: <FaBook className="w-6 h-6" />,
    },
    {
      href: "/stats",
      label: "Statystyki",
      icon: <FaChartBar className="w-6 h-6" />,
    },

    {
      href: "https://github.com/miskibin/sejm-stats/issues/new/choose",
      label: "Zgłoś błąd",
      icon: <FaGithub className="w-6 h-6" />,
    },
    {
      href: "https://chat.sejm-stats.pl/",
      label: "Asystent prawny",
      icon: <ExternalLink className="w-6 h-6" />,
    },
  ];

  const footerLinks = [
    {
      href: "https://docs.sejm-stats.pl/",
      label: "Dokumentacja",
      icon: <FaBook className="w-6 h-6 text-blue-600" />,
    },
    {
      href: "https://patronite.pl/sejm-stats",
      label: "Patronite",
      icon: <FaHeart className="w-6 h-6 text-red-600" />,
    },
    {
      href: "https://www.youtube.com/@sejm-stats",
      label: "YouTube",
      icon: <FaYoutube className="w-6 h-6 text-red-600" />,
    },
    {
      href: "https://discord.com/invite/zH2J3z5Wbf",
      label: "Discord",
      icon: <FaDiscord className="w-6 h-6 text-blue-600" />,
    },
    {
      href: "https://github.com/miskibin/sejm-stats",
      label: "Github",
      icon: <FaGithub className="w-6 h-6 text-gray-600" />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <html lang="pl" className="h-full">
          <body className="h-full ">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "16rem",
                  } as React.CSSProperties
                }
              >
                <AppSidebar menuItems={menuItems} />
                <SidebarInset className="flex min-h-screen w-full flex-col">
                  <Navbar>
                    <SidebarTrigger className="-ml-1" />
                  </Navbar>
                  <main className="overflow-y-auto min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
                    <div className="w-full">
                      <Breadcrumbs />
                      {children}
                    </div>
                  </main>
                  <Footer links={footerLinks} />
                </SidebarInset>
              </SidebarProvider>
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default ClientLayout;
