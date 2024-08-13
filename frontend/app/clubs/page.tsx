"use client";
import ClubsList from "@/app/clubs/clubList";
import ClubsChart from "@/app/clubs/clubChart";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import LoadableContainer from "@/components/loadableContainer";
import { useSearchParams } from "next/navigation";
import { APIResponse, Club } from "@/lib/types";
import { useFetchData } from "@/lib/api";

export default function ClubsPage() {
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useFetchData<APIResponse<Club>>(`/clubs/`);
  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 m-1">
      <LoadableContainer className="col-span-1">
        <h2 className="text-2xl font-normal   mb-4">
          Lista Klubów
        </h2>
        <ClubsList clubs={data.results} />
      </LoadableContainer>
      <LoadableContainer className="col-span-1">
        <h2 className="text-2xl font-normal  mb-4">
          Rozkład mandatów{" "}
        </h2>
        <ClubsChart clubs={data.results} />
      </LoadableContainer>
    </div>
  );
}
