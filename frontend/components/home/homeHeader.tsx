"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaChartBar, FaUsers, FaVoteYea } from "react-icons/fa";
import DateRangeModal from "../dateRangeModal";
import { motion } from "framer-motion";
import styles from "@/app/home.module.css";

export const HomeHeader: React.FC = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsModalOpen(true);
    }
  };

  const handleDateRangeSelect = (
    range: string,
    options: Record<string, boolean>
  ) => {
    setIsModalOpen(false);
    const searchParams = new URLSearchParams({
      q: searchQuery,
      range: range,
      ...Object.entries(options).reduce((acc, [key, value]) => {
        if (value) acc[key] = "true";
        return acc;
      }, {} as Record<string, string>),
    });
    router.push(`/search-results?${searchParams.toString()}`);
  };

  return (
    <>
      <header
        className={`relative overflow-hidden ${styles.bgBanner} border-b border-gray-200 py-16 lg:px-12 sm:px-1`}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-4"
          >
            Parlament Pod Lupą <FaVoteYea />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Kompleksowy przegląd aktywności sejmowej
          </motion.p>
          <form onSubmit={handleSearch} className="max-w-md mb-8">
            <div className="flex">
              <input
                type="search"
                className="w-full px-4 py-2 rounded-l-lg "
                placeholder="Wpisz jakiekolwiek słowo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-400 transition"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          <div className="flex space-x-4">
            <Link
              href="/envoys"
              className="bg-white text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition flex items-center"
            >
              <FaUsers className="mr-2" /> Przegląd posłów
            </Link>
            <Link
              href="/stats"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-400 transition flex items-center"
            >
              <FaChartBar className="mr-2" /> Statystyki
            </Link>
          </div>
        </div>
      </header>

      <DateRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleDateRangeSelect}
      />
    </>
  );
};
