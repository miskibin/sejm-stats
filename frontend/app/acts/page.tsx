import { DataTable } from "@/components/dataTable/dataTable";
import { fetchAllActs } from "@/lib/api";
import LoadableContainer from "@/components/loadableContainer";
import { columns } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Akty prawne - Sejm-stats',
  description: 'Lista aktów prawnych',
}

async function ActsTable() {
  const acts = await fetchAllActs();

  const filters = [
    { columnKey: "publisher", title: "Wydawca" },
    { columnKey: "status", title: "Status" },
    { columnKey: "announcementDate", title: "Data ogłoszenia" },
    { columnKey: "entryIntoForce", title: "Data wejścia w życie" },
  ];

  return (
    <>
      <DataTable columns={columns} data={acts} filters={filters} />;
    </>
  );
}

export default async function ActsPage() {
  return (
    <LoadableContainer>
      <ActsTable />
    </LoadableContainer>
  );
}