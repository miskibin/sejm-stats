"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import LoadableContainer from "@/components/loadableContainer";
import { Voting } from "@/lib/types";
import { columns } from "./columns";

export default function VotingResultsPage() {
  const searchParams = useSearchParams();
  const [votings, setVotings] = useState<Voting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVotings() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/votings/?${searchParams?.toString()}`
        );
        const data = await response.json();
        setVotings(data.results);
      } catch (error) {
        console.error("Error fetching votings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVotings();
  }, [searchParams]);

  const filters = [
    { columnKey: "category", title: "Kategoria" },
    { columnKey: "kind", title: "Rodzaj głosowania" },
    { columnKey: "date", title: "Data głosowania" },
    { columnKey: "success", title: "Status" },
  ];

  return (
    <LoadableContainer>
      {isLoading ? (
        <div>Ładowanie...</div>
      ) : (
        <DataTable columns={columns} data={votings} filters={filters} />
      )}
    </LoadableContainer>
  );
}