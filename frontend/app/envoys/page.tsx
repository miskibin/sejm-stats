import { Suspense } from "react";
// import { fetchEnvoys, fetchClubs, fetchDistricts } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/spinner";

export default async function EnvoysPage() {
  // const initialData = await fetchEnvoys();
  // const clubs = await fetchClubs();
  // const districts = await fetchDistricts();

  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<LoadingSpinner />}>
      </Suspense>
    </div>
  );
}
