"use client";
import { DataTable } from "@/components/dataTable/dataTable";
import { columns, getColumnsWithClickHandler } from "./columns";
import LoadableContainer from "@/components/loadableContainer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

async function InterpellationsTable() {
    const searchParams = useSearchParams();
    const [interpellations, setInterpellations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      async function fetchActs() {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/interpellations/?${searchParams?.toString()}`
          );
          const data = await response.json();
          setInterpellations(data.results);
        } catch (error) {
          console.error("Error fetching acts:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchActs();
  
    }, [searchParams]);
  
  const filters = [
    { columnKey: "member", title: "Autor" },
    { columnKey: "sentDate", title: "Data wysłania" },
  ];
  return (
    <>
      {isLoading && <p className="text-center mt-4">Ładowanie...</p>}
      <DataTable columns={getColumnsWithClickHandler()} data={interpellations} filters={filters} />;
    </>
  );
}

export default function InterpellationsPage() {
  return (
    <div className="mx-1">

    <LoadableContainer>
      <InterpellationsTable />
    </LoadableContainer>
    </div>
  );
}
