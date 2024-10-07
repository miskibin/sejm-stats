"use client";
import React from "react";
import { FaArchive, FaChartBar, FaVoteYea } from "react-icons/fa";
import StatCard from "./statCard";
import VotingCard from "./votingCard";
import { NewsCard } from "../newsCard";
import Notification from "../ui/notification";
import { motion } from "framer-motion";
import { ArticleListItem } from "@/lib/types";
import { PartyPopperIcon } from "lucide-react";

export interface HomeProps {
  latestVotings: any[];
  allClubs: number;
  cards: any[];
  lastArticles: ArticleListItem[];
}

const Home: React.FC<HomeProps> = ({
  latestVotings,
  allClubs,
  cards,
  lastArticles,
}) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-2 row-span-1",
    large: "col-span-2 row-span-2",
  };

  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-3xl font-semibold mb-6 flex items-center">
              <FaChartBar className="mr-2 text-blue-500" /> Statystyki
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <StatCard {...card} />
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 flex items-center">
              <FaVoteYea className="mr-2 text-blue-500" /> Ostatnie Głosowania
            </h2>
            <div className="space-y-6">
              {latestVotings.map((voting, index) => (
                <motion.div
                  key={voting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <VotingCard voting={voting} />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold mb-6 flex items-center">
            <FaArchive className="mr-2 text-blue-500" /> Artykuły
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[200px]">
            {Array.isArray(lastArticles) &&
              lastArticles.map((item, index) => {
                let size: "small" | "medium" | "large";
                if (index === 0) size = "large";
                else if (index % 5 === 3) size = "medium";
                else size = "small";

                return (
                  <motion.div
                    key={index}
                    className={sizeClasses[size]}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NewsCard
                      id={item.id}
                      title={item.title}
                      image={item.image}
                      size={size}
                    />
                  </motion.div>
                );
              })}
          </div>
        </section>
      </main>

      <Notification />
    </>
  );
};

export default Home;
