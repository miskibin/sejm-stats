"use client";
import Home from "@/components/home/home";
import { Suspense } from "react";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import type { Metadata } from "next";
import { useFetchData } from "@/lib/api";
import LoadableContainer from "@/components/loadableContainer";
import LoginButton from "@/components/ui/loginButton";
import { HomeHeader } from "@/components/home/homeHeader";

async function HomeContainer() {
  const { data, isLoading, error } = useFetchData<any>(`/home/`);
  if (isLoading) return <SkeletonComponent />;
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <HomeHeader />
      <Suspense fallback={<SkeletonComponent />}>
        <HomeContainer />
      </Suspense>
    </div>
  );
}
