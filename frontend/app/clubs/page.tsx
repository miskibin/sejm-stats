"use client";

import { useState } from "react";
import ClubsList from "@/app/clubs/clubList";
import ClubsChart from "@/app/clubs/clubChart";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import LoadableContainer from "@/components/loadableContainer";
import { useSearchParams } from "next/navigation";
import { APIResponse, Club } from "@/lib/types";
import { useFetchData } from "@/lib/api";
import { motion } from "framer-motion";

export default function ClubsPage() {
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useFetchData<APIResponse<Club>>(`/clubs/`);
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list");

  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Kluby Parlamentarne</h1>
      <div className="flex justify-center mb-6">
        <TabButton active={activeTab === "list"} onClick={() => setActiveTab("list")}>
          Lista Klubów
        </TabButton>
        <TabButton active={activeTab === "chart"} onClick={() => setActiveTab("chart")}>
          Rozkład Mandatów
        </TabButton>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === "list" ? (
          <ClubsList clubs={data.results} />
        ) : (
          <ClubsChart clubs={data.results} />
        )}
      </motion.div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 mx-2 rounded-full transition-all duration-300 ${
      active
        ? "bg-blue-500 text-white shadow-lg"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);