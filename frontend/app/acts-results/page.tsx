"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import LoadableContainer from "@/components/loadableContainer";
import { Act } from "@/lib/types";
import { columns } from "./columns";

export default function ActsResultsPage() {
  const searchParams = useSearchParams();
  const [acts, setActs] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActs() {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/acts/?${searchParams.toString()}`);
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
    <LoadableContainer>
      {isLoading ? (
        <div>Ładowanie...</div>
      ) : (
        <DataTable columns={columns} data={acts} filters={filters} />
      )}
    </LoadableContainer>
  );
}