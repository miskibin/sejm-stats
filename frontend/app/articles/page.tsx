"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArticleListItem } from "@/lib/types";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/components/newsCard";
import { fetchLatestArticles } from "@/lib/api";

const ArticleListPage: React.FC = () => {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchLatestArticles();
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (err) {
        setError("Failed to load articles. Please try again later.");
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    "Wszystkie",
    "Polityka",
    "Sport",
    "Kultura",
    "Technologia",
  ];

  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-2 row-span-1",
    large: "col-span-2 row-span-2",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <main className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h1 className="text-4xl font-bold mb-8">Najnowsze Artykuły</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Szukaj artykułów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full text-lg rounded-full"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            <Button className="w-full sm:w-auto px-8 py-3 text-lg rounded-full">
              Szukaj
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="bg-white dark:bg-gray-800 rounded-full shadow-md p-2 inline-flex">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category.toLowerCase()}
                onClick={() => setActiveCategory(category.toLowerCase())}
                className="px-6 py-3 text-lg font-medium rounded-full"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[280px]">
          {filteredArticles.map((article, index) => {
            let size: "small" | "medium" | "large" = "small";
            if (index === 0) size = "large";
            else if (index % 5 === 3) size = "medium";

            return (
              <motion.div
                key={article.id}
                className={sizeClasses[size]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NewsCard
                  id={article.id}
                  title={article.title}
                  image={article.image}
                  size={size}
                />
              </motion.div>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <motion.div
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-3xl font-semibold">Nie znaleziono artykułów.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ArticleListPage;
