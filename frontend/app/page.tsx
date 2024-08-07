"use client"
import Home from "@/components/home";
import { Suspense } from "react";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import type { Metadata } from 'next'
import { useFetchData } from "@/lib/api";
import LoadableContainer from "@/components/loadableContainer";

async function HomeContainer() {
  const { data, isLoading, error } = useFetchData<any>(`/home/`);
  if (isLoading) return <SkeletonComponent/>
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;
  return (
    <Home
      latestVotings={data.latest_votings}
      allClubs={data.all_clubs}
      cards={data.cards}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SkeletonComponent />}>
      <HomeContainer />
    </Suspense>
  );
}
