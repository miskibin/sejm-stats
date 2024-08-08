import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  menuItems: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ menuItems, isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 dark:bg-gray-300 text-gray-100 dark:text-gray-900 p-4
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-2xl font-extrabold">Sejm-Stats</span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
            aria-label="Close sidebar"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                pathname === item.href
                  ? "bg-blue-500 text-white dark:bg-blue-300 dark:text-gray-900"
                  : "text-gray-300 dark:text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900"
              }`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
