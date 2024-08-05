"use client";

import React from "react";
import Link from "next/link";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import StatCard from "./statCard";
import VotingCard from "./votingCard";
import styles from "@/app/home.module.css";
import NewsCard from "./newsCard";
export interface HomeProps {
  latestVotings: any[];
  allClubs: number;
  cards: any[];
}

const Home: React.FC<HomeProps> = ({ latestVotings, allClubs, cards }) => {
  const newsItems = [
    {
      title:
        "Amazon Shoppers Are Ditching Designer Belts For This Best-Selling",
      category: "Europe",
      imageUrl: "/home.webp",
      link: "#",
      isWide: true,
    },
    {
      title: "News Magazines Are Becoming Obsolete, Replaced By Gadgets",
      category: "Techno",
      imageUrl:"/home.webp",
      link: "#",
    },
    {
      title:
        "Minimalist Designs Are Starting To Be Popular With The Next Generation",
      category: "Architecture",
      imageUrl:"/home.webp",
      link: "#",
    },
    {
      title: "Tips For Decorating The Interior Of The Living Room",
      category: "Interior",
      imageUrl:"/home.webp",
      link: "#",
    },
    {
      title:
        "Online Taxi Users Are Increasing Drastically Ahead Of The New Year",
      category: "Lifestyle",
      imageUrl:"/sejm.webp",
      link: "#",
    },
  ];

  return (
    <div className="container min-w-full px-0 mx-auto">
      <div
        className={`relative overflow-hidden ${styles.bgBanner} border-b border-gray-200 py-16 lg:px-12 sm:px-1 `}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-6xl font-light text-gray-700 mb-4">
            Parlament Pod Lupą
          </h1>
          <p className="text-xl text-gray-500 mb-8">
            <strong>Kompleksowy przegląd aktywności sejmowej</strong>
          </p>
          <div className="max-w-md mb-8">
            <div className="flex">
              <input
                type="search"
                className="form-input flex-grow rounded-l-lg p-2"
                placeholder="Wpisz hasła odzielone przecinkami"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
                <FaSearch />
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/envoys"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Przegląd posłów
            </Link>
            <Link
              href="/faq"
              className="bg-white text-blue-500 border border-blue-500 px-6 py-2 rounded hover:bg-blue-50 transition"
            >
              O zespole
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 px-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-4xl text-neutral-700 mb-4">Statystyki</h2>
          <div className="grid grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl text-neutral-700  mb-4">
            Ostatnie Głosowania
          </h2>
          <div className="space-y-4">
            {latestVotings.map((voting) => (
              <VotingCard key={voting.id} voting={voting} />
            ))}
          </div>
        </div>
      </div>
      <div className=" max-w-7xl px-4 mx-auto">
        <h1 className="text-5xl text-neutral-700  mt-8 mb-4">Aktualności</h1>
        <hr className="my-4" />
        <section
          id="articles"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Articles will be loaded dynamically */}
        </section>
      </div>
      <div className="max-w-7xl px-4 mx-auto mt-16">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">
          Aktualności
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <NewsCard
              key={index}
              title={item.title}
              category={item.category}
              imageUrl={item.imageUrl}
              link={item.link}
              isWide={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
