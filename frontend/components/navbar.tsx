"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { ModeToggle } from "./ModeToggle"; // Adjust the import path as necessary

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-red-600 dark:border-red-400">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">{children}</div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Link
              href="/profile"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              aria-label="Profile"
            >
              <FaUser />
            </Link>
            <Link
              href="/logout"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              aria-label="Logout"
            >
              <FaSignOutAlt />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
