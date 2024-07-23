import { DataTable } from "@/components/dataTable/dataTable";
import { columns } from "./columns";
import { fetchAllInterpellations } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import LoadableContainer from "@/components/card";

async function InterpellationsTable() {
  const interpellations = await fetchAllInterpellations();

  return <DataTable columns={columns} data={interpellations} />;
}

export default async function InterpellationsPage() {
  return (
    <LoadableContainer>
      <InterpellationsTable />
    </LoadableContainer>
  );
}
