"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import LoadableContainer from "@/components/loadableContainer";
import { Act } from "@/lib/types";
import { getColumnsWithClickHandler } from "./columns";

export default function ActsResultsPage() {
  const searchParams = useSearchParams();
  const [acts, setActs] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActs() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/acts/?${searchParams?.toString()}`
        );
        const data = await response.json();
        setActs(data.results);
      } catch (error) {
        console.error("Error fetching acts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActs();

  }, [searchParams]);

  const filters = [
    { columnKey: "publisher", title: "Wydawca" },
    { columnKey: "status", title: "Status" },
    { columnKey: "announcementDate", title: "Data ogłoszenia" },
    { columnKey: "entryIntoForce", title: "Data wejścia w życie" },
  ];

  return (
    <div className="mx-1">

    <LoadableContainer>
      {isLoading ? (
        <div>Ładowanie...</div>
      ) : (
        <DataTable columns={getColumnsWithClickHandler()} data={acts} filters={filters} />
      )}
    </LoadableContainer>
      </div>
  );
}
