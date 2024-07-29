// components/EnvoyList.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetchEnvoys } from "@/lib/api";
import { EnvoyCard } from "./envoyCard";

interface EnvoyListProps {
  initialData: any;
}

export const EnvoyList: React.FC<EnvoyListProps> = ({ initialData }) => {
  const [page, setPage] = useState(1);
  const { data, error } = useSWR(
    `/api/envoys?page=${page}`,
    () => fetchEnvoys(page),
    {
      fallbackData: initialData,
    }
  );

  if (error) return <div>Failed to load envoys</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-4">
      {data.results.map((envoy: any) => (
        <EnvoyCard
          key={envoy.id}
          id={envoy.id}
          firstName={envoy.firstName}
          lastName={envoy.lastName}
          photo={envoy.photo}
          clubPhoto={envoy.club_photo}
          active={envoy.active}
          numberOfVotes={envoy.numberOfVotes}
        />
      ))}
      {data.next && (
        <button
          onClick={() => setPage(page + 1)}
          className="col-span-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
};
