import { DataTable } from "@/components/dataTable/dataTable";
import { fetchAllCommittees } from "@/lib/api";
import LoadableContainer from "@/components/loadableContainer";
import { columns } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Komisje sejmowe - Sejm-stats',
  description: 'Lista komisji sejmowych',
}

async function CommitteesTable() {
  const committees = await fetchAllCommittees();

  const filters = [
    { columnKey: "type", title: "Typ" },
    { columnKey: "appointmentDate", title: "Data powołania" },
    { columnKey: "compositionDate", title: "Data składu" },
  ];

  return (
    <>
      <DataTable columns={columns} data={committees} filters={filters} />;
    </>
  );
}

export default async function CommitteesPage() {
  return (
    <LoadableContainer>
      <CommitteesTable />
    </LoadableContainer>
  );
}