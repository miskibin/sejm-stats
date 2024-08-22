"use client";
import React from "react";
import ClubsList from "@/app/clubs/clubList";
import ClubsChart from "@/app/clubs/clubChart";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import { APIResponse, Club } from "@/lib/types";
import { useFetchData } from "@/lib/api";
import { Card } from "@/components/ui/card";

export default function ClubsPage() {
  const { data, isLoading, error } = useFetchData<APIResponse<Club>>(`/clubs/`);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        <Card className="p-3">
          <h2 className="text-xl font-light mb-4">Lista Klubów</h2>
          <ClubsList clubs={data.results} />
        </Card>
        <Card className="p-3">
          <h2 className="text-xl font-light mb-4">Rozkład Mandatów</h2>
          <ClubsChart clubs={data.results} />
        </Card>
      </div>
    </div>
  );
}
