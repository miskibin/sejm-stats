"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Users } from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";
import { DataTable } from "@/components/dataTable/dataTable";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const VotingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const {
    data: voting,
    isLoading,
    error,
  } = useFetchData<any>(`/votings/${id}/`);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <>{error.message}</>;
  if (!voting) return null;

  const totalVotesData = [
    { name: "Za", value: voting.yes, fill: "hsl(var(--chart-1))" },
    { name: "Przeciw", value: voting.no, fill: "hsl(var(--chart-2))" },
    {
      name: "Wstrzymało się",
      value: voting.abstain,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const clubVotesData = voting.club_votes.map((cv: any) => ({
    club: cv.club.id,
    yes: cv.yes,
    no: cv.no,
    abstain: cv.abstain,
  }));

  const genderVotesData = [
    {
      gender: "Mężczyźni",
      za: voting.sex_votes.male.yes,
      przeciw: voting.sex_votes.male.no,
      wstrzymal: voting.sex_votes.male.abstain,
    },
    {
      gender: "Kobiety",
      za: voting.sex_votes.female.yes,
      przeciw: voting.sex_votes.female.no,
      wstrzymal: voting.sex_votes.female.abstain,
    },
  ];

  const totalVotesConfig: ChartConfig = {
    value: { label: "Głosy" },
    Za: { label: "Za", color: "hsl(var(--chart-1))" },
    Przeciw: { label: "Przeciw", color: "hsl(var(--chart-2))" },
    "Wstrzymało się": { label: "Wstrzymało się", color: "hsl(var(--chart-3))" },
  };

  const clubVotesConfig: ChartConfig = {
    yes: { label: "Za", color: "hsl(var(--chart-1))" },
    no: { label: "Przeciw", color: "hsl(var(--chart-2))" },
    abstain: { label: "Wstrzymało się", color: "hsl(var(--chart-3))" },
  };

  const genderVotesConfig: ChartConfig = {
    za: { label: "Za", color: "hsl(var(--chart-1))" },
    przeciw: { label: "Przeciw", color: "hsl(var(--chart-2))" },
    wstrzymal: { label: "Wstrzymało się", color: "hsl(var(--chart-3))" },
  };

  const voteColumns = [
    { accessorKey: "MP", header: "Poseł" },
    { accessorKey: "vote", header: "Głos" },
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 space-y-5 sm:space-y-12">
      <h1 className="text-xl sm:text-2xl font-bold">{voting.topic}</h1>

      <Card className="w-full my-2">
        <CardHeader>
          <CardTitle>Podsumowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{voting.summary}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{voting.success ? "Przegłosowano" : "Nie przegłosowano"}</Badge>
            <Badge variant="secondary">{voting.category}</Badge>
            <Badge variant="secondary">Rodzaj: {voting.kind}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-y-6">
        <Card className="w-full my-2">
          <CardHeader>
            <CardTitle>Głosowanie klubów</CardTitle>
          </CardHeader>
          <CardContent className=" p-1 ">
            <ChartContainer config={clubVotesConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clubVotesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="club" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="yes" stackId="a" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="no" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="abstain" stackId="a" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-full my-2">
          <CardHeader>
            <CardTitle>Wyniki głosowania</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <ChartContainer config={totalVotesConfig} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalVotesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="96%"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="w-full my-2">
          <CardHeader>
            <CardTitle>Głosy posłów</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <DataTable
              columns={voteColumns}
              data={voting.votes}
              filters={[]}
              rowsPerPage={2}
            />
          </CardContent>
        </Card>

        <Card className="w-full my-2">
          <CardHeader>
            <CardTitle>Głosy według płci</CardTitle>
          </CardHeader>
          <CardContent className=" p-1 ">
            <ChartContainer config={genderVotesConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderVotesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="gender" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="za" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="przeciw" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="wstrzymal" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Powiązane druki</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {voting.prints.map((print: any) => (
              <li key={print.id}>
                <Link
                  href={print.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {print.title}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {(voting.similar_votings.length > 0 || voting.processes.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {voting.similar_votings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Powiązane głosowania</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {voting.similar_votings.map((v: any) => (
                    <li key={v.id}>
                      <Link
                        href={`/votings/${v.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {v.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {voting.processes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Powiązane procesy</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {voting.processes.map((p: any) => (
                    <li key={p.id}>
                      <Link
                        href={`/processes/${p.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default VotingDetail;
