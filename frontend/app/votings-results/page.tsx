"use client";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import { columns, useColumnsWithClickHandler } from "./columns";
import { useFetchData } from "@/lib/api";
import { APIResponse, Voting } from "@/lib/types";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import { useMemo } from "react";

function VotingResultsTable() {
  const searchParams = useSearchParams();
  const columnsWithClickHandler = useColumnsWithClickHandler();
  const { data, isLoading, error } = useFetchData<APIResponse<Voting>>(
    `/votings/?${searchParams?.toString()}`
  );

  const filters = useMemo(
    () => [
      { columnKey: "category", title: "Kategoria" },
      { columnKey: "sitting", title: "Posiedzenie" },
    ],
    []
  );

  const processedData = useMemo(() => {
    if (!data) return [];
    return data.results.map((result) => ({
      ...result,
      title: (
        <>
          {result.title}
          <p className="font-semibold">
            {result.description ? result.description : result.topic}
          </p>
        </>
      ),
    }));
  }, [data]);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <DataTable
      columns={columnsWithClickHandler}
      data={processedData}
      filters={filters}
      defaultVisibleColumns={["title", "date" ]}
    />
  );
}

export default function VotingResultsPage() {
  return (
    <div className="mx-1">
      <VotingResultsTable />
    </div>
  );
}
