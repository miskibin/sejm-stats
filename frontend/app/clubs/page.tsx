"use client";

import ClubsList from "@/app/clubs/clubList";
import ClubsChart from "@/app/clubs/clubChart";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import LoadableContainer from "@/components/loadableContainer";
import { APIResponse, Club } from "@/lib/types";
import { useFetchData } from "@/lib/api";

export default function ClubsPage() {
  const { data, isLoading, error } = useFetchData<APIResponse<Club>>(`/clubs/`);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  ">
      <h1 className="text-4xl font-bold text-center mb-8">
        Kluby Parlamentarne
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Lista Klubów</h2>
          <ClubsList clubs={data.results} />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Rozkład Mandatów</h2>
          <ClubsChart clubs={data.results} />
        </div>
      </div>
    </div>
  );
}
