"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import StatCard from "./statCard";
import VotingCard from "./votingCard";
import styles from "@/app/home.module.css";
import NewsCard from "./newsCard";
import DateRangeModal from "./dateRangeModal";
import Notification from "./ui/notification";

export interface HomeProps {
  latestVotings: any[];
  allClubs: number;
  cards: any[];
}

const Home: React.FC<HomeProps> = ({ latestVotings, allClubs, cards }) => {
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
    <div className="container min-w-full px-0 mx-auto">
      <div
        className={`relative overflow-hidden ${styles.bgBanner} border-b border-gray-200 py-16 lg:px-12 sm:px-1`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl font-light text-gray-700 dark:text-gray-100 mb-4">
            Parlament Pod Lupą
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
            <strong>Kompleksowy przegląd aktywności sejmowej</strong>
          </p>
          <form onSubmit={handleSearch} className="max-w-md mb-8">
            <div className="flex">
              <input
                type="search"
                className="form-input flex-grow border-2 rounded-l-lg p-2"
                placeholder="Wpisz jakie kolwiek słowo"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          <div className="flex space-x-4">
            <Link
              href="/envoys"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Przegląd posłów
            </Link>
            <Link
              href="/stats"
              className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded hover:bg-blue-50 transition"
            >
              Statystyki
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 px-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-4xl  mb-4">Statystyki</h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {cards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl  mb-4">Ostatnie Głosowania</h2>
          <div className="space-y-4">
            {latestVotings.map((voting) => (
              <VotingCard key={voting.id} voting={voting} />
            ))}
          </div>
        </div>
      </div>
      <div className=" max-w-7xl px-4 mx-auto">
        <h1 className="text-5xl   mt-8 mb-4">Aktualności</h1>
        <hr className="my-4" />
        <section
          id="articles"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Articles will be loaded dynamically */}
        </section>
      </div>
      <div className="max-w-7xl px-4 mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {newsItems.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              category={item.category}
              imageUrl={item.imageUrl}
              link={item.link}
              isWide={index === 0}
            />
          ))} */}
        </div>
      </div>
      <DateRangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleDateRangeSelect}
      />
      <Notification />
    </div>
  );
};

export default Home;
