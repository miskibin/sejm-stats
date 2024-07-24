"use client";
import React, { ReactNode, useState } from "react";
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
} from "react-icons/fa";
import { FiYoutube, FiHeart, FiGithub } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Breadcrumbs from "@/components/breadcrumbs";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <html lang="en" className="h-full bg-neutral-50">
      <body className="h-min-screen">
        <div className="flex overflow-hidden">
          {/* Sidebar for larger screens */}
          <div className="hidden md:flex">
            <Sidebar
              menuItems={menuItems}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          {/* Sidebar for mobile, shown when sidebarOpen is true */}
          <div
            className={`md:hidden fixed inset-0 z-50 ${
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
                className="md:hidden p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <FaBars className="h-6 w-6" />
              </button>
            </Navbar>

            <main className="min-h-[85vh]   bg-neutral-100">
              <Breadcrumbs />
              {children}
            </main>
            <Footer links={footerLinks} />
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
