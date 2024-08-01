import { Suspense } from "react";
import ClubsList from "@/app/clubs/clubList";
import ClubsChart from "@/app/clubs/clubChart";
import { LoadingSpinner } from "@/components/ui/spinner";
import LoadableContainer from "@/components/loadableContainer";
import { fetchAllActs, fetchAllClubs } from "@/lib/api";

export default async function ClubsPage() {
  const clubsData = await fetchAllClubs();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1  m-1">
      <LoadableContainer>
        <h2 className="text-2xl font-normal text-gray-700  mb-4">
          Lista Klubów
        </h2>
        <ClubsList clubs={clubsData} />
      </LoadableContainer>
      <LoadableContainer>
        <h2 className="text-2xl font-normal text-gray-700 mb-4">
          Rozkład mandatów{" "}
        </h2>
        <ClubsChart clubs={clubsData} />
      </LoadableContainer>
    </div>
  );
}
