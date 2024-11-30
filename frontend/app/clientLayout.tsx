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
import { ExternalLink, Sparkle, Sparkles } from "lucide-react";

type ClientLayoutProps = {
  children: ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  const footerLinks = [
    {
      href: "https://chat.sejm-stats.pl/",
      label: "Asystent prawny",
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
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
                <AppSidebar />
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
