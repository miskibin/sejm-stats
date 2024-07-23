import Home from "@/components/home";
import { Suspense } from "react";
import { fetchHomeData } from "../lib/api";
import { LoadingSpinner } from "@/components/ui/spinner";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Sejm-Stats',
  description: 'Kompleksowy przegląd aktywności sejmowej',
}
async function HomeContainer() {
  const homeData = await fetchHomeData();

  return (
    <Home
      latestVotings={homeData.latest_votings}
      allClubs={homeData.all_clubs}
      cards={homeData.cards}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContainer />
    </Suspense>
  );
}
