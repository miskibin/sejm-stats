"use client";
import { ThemeProvider } from "@/components/theme-provider";
import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
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

type ClientLayoutProps = {
  children: ReactNode;
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  const menuItems = [
    { href: "/", label: "Strona główna", icon: <FaHome className="w-5 h-5" /> },
    {
      href: "/envoys",
      label: "Posłowie",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      href: "/votings",
      label: "Głosowania",
      icon: <FaVoteYea className="w-5 h-5" />,
    },
    {
      href: "/processes",
      label: "Procesy legislacyjne",
      icon: <FaCogs className="w-5 h-5" />,
    },
    {
      href: "/faq",
      label: "O projekcie",
      icon: <FaAddressBook className="w-5 h-5" />,
    },
    {
      href: "/committees",
      label: "Komisje sejmowe",
      icon: <FaPeopleCarry className="w-5 h-5" />,
    },
    {
      href: "/clubs",
      label: "Kluby parlamentarne",
      icon: <FaHandshake className="w-5 h-5" />,
    },
    {
      href: "/interpellations",
      label: "Interpelacje",
      icon: <FaCommentDots className="w-5 h-5" />,
    },
    {
      href: "/acts",
      label: "Dziennik ustaw",
      icon: <FaBook className="w-5 h-5" />,
    },
    {
      href: "/stats",
      label: "Statystyki",
      icon: <FaChartBar className="w-5 h-5" />,
    },

    {
      href: "https://github.com/miskibin/sejm-stats/issues/new/choose",
      label: "Zgłoś błąd",
      icon: <FaGithub className="w-5 h-5" />,
    },
  ];

  const footerLinks = [
    {
      href: "https://docs.sejm-stats.pl/",
      label: "Dokumentacja",
      icon: <FaBook className="w-5 h-5 text-blue-600" />,
    },
    {
      href: "https://patronite.pl/sejm-stats",
      label: "Patronite",
      icon: <FaHeart className="w-5 h-5 text-red-600" />,
    },
    {
      href: "https://www.youtube.com/@sejm-stats",
      label: "YouTube",
      icon: <FaYoutube className="w-5 h-5 text-red-600" />,
    },
    {
      href: "https://discord.com/invite/zH2J3z5Wbf",
      label: "Discord",
      icon: <FaDiscord className="w-5 h-5 text-blue-600" />,
    },
    {
      href: "https://github.com/miskibin/sejm-stats",
      label: "Github",
      icon: <FaGithub className="w-5 h-5 text-gray-600" />,
    },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <html lang="pl" className="h-full ">
          <body className="h-min-screen">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="flex overflow-hidden bg-neutral-50 dark:bg-neutral-700">
                {/* Sidebar for larger screens */}
                <div className="hidden lg:flex">
                  <Sidebar
                    menuItems={menuItems}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                </div>
                {/* Sidebar for mobile, shown when sidebarOpen is true */}
                <div
                  className={`lg:hidden fixed inset-0 z-50 ${
                    sidebarOpen ? "block" : "hidden"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-gray-600 opacity-75"
                    onClick={() => setSidebarOpen(false)}
                  ></div>
                  <div className="absolute  left-0 w-64 bg-white">
                    <Sidebar
                      menuItems={menuItems}
                      isOpen={sidebarOpen}
                      onClose={() => setSidebarOpen(false)}
                    />
                  </div>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden ">
                  <Navbar>
                    <button
                      className="lg:hidden p-2"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      aria-label="Toggle sidebar"
                    >
                      <FaBars className="h-6 w-6" />
                    </button>
                  </Navbar>

                  <main className="min-h-[calc(100vh-65px-57px)]   dark:bg-gray-900  bg-neutral-100">
                    <Breadcrumbs />
                    {children}
                  </main>
                  <Footer links={footerLinks} />
                </div>
              </div>
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default ClientLayout;
