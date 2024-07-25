import { DataTable } from "@/components/dataTable/dataTable";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { fetchAllInterpellations } from "@/lib/api";
import LoadableContainer from "@/components/loadableContainer";
import { max } from "date-fns";

async function InterpellationsTable() {
  const interpellations = await fetchAllInterpellations();

  const filters = [
    { columnKey: "member", title: "Autor" },
    { columnKey: "sentDate", title: "Data wysłania" },
  ];
  return (
    <>
      <DataTable columns={columns} data={interpellations} filters={filters} />;
    </>
  );
}

export default async function InterpellationsPage() {
  return (
    <LoadableContainer>
      <InterpellationsTable />
    </LoadableContainer>
  );
}
