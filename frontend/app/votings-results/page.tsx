"use client";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import { columns, useColumnsWithClickHandler } from "./columns";
import { useFetchData } from "@/lib/api";
import { APIResponse, Voting } from "@/lib/types";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import { Suspense } from "react";

async function VotingResultsTable() {
  const searchParams = useSearchParams();
  const columns = useColumnsWithClickHandler();
  const { data, isLoading, error } = useFetchData<APIResponse<Voting>>(
    `/votings/?${searchParams?.toString()}`
  );

  if (isLoading) return <SkeletonComponent />;
  if (error) return <>{error.message}</>;
  if (!data) return null;

  const filters = [
    { columnKey: "category", title: "Kategoria" },
    { columnKey: "date", title: "Data głosowania" },
  ];

  return (
    <DataTable
      columns={columns}
      data={data.results}
      filters={filters}
    />
  );
}

export default function VotingResultsPage() {
  return (
    <div className="mx-1">
      <Suspense fallback={<SkeletonComponent />}>
        <VotingResultsTable />
      </Suspense>
    </div>
  );
}