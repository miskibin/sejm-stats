"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import LoadableContainer from "@/components/loadableContainer";
import { columns, useColumnsWithClickHandler } from "./columns";

export default function CommitteesPage() {
  const searchParams = useSearchParams();
  const [committees, setCommittees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommittees() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/committees/?${searchParams?.toString()}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch committees');
        }
        const data = await response.json();
        setCommittees(data.results || data); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching committees:", error);
        setError("Failed to fetch committees. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCommittees();
  }, [searchParams]);

  const filters = [
    { columnKey: "type", title: "Typ" },
    { columnKey: "compositionDate", title: "Data powołania" },
  ];
  const columnsWithClickHandler = useColumnsWithClickHandler();

  return (
    <div className="mx-1">

    <LoadableContainer>
      {isLoading ? (
        <div>Ładowanie...</div>
      ) : error ? (
        <div>Błąd: {error}</div>
      ) : (
        <DataTable columns={columnsWithClickHandler} data={committees} filters={filters} />
      )}
    </LoadableContainer>
      </div>
  );
}