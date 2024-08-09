"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ExternalLink,
  Home,
  FileText,
  Users,
  BarChart,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { DataTable } from "@/components/dataTable/dataTable";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

  const totalVotesData = {
    labels: voting.total_labels,
    datasets: [
      {
        data: voting.total_data,
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
      },
    ],
  };
  const genderVotesData = {
    labels: ["Za", "Przeciw", "Wstrzymał się"],
    datasets: [
      {
        label: "Mężczyźni",
        data: [
          voting.sex_votes.male.yes,
          voting.sex_votes.male.no,
          voting.sex_votes.male.abstain,
        ],
        backgroundColor: "#3B82F6",
      },
      {
        label: "Kobiety",
        data: [
          voting.sex_votes.female.yes,
          voting.sex_votes.female.no,
          voting.sex_votes.female.abstain,
        ],
        backgroundColor: "#EC4899",
      },
    ],
  };

  const genderVotesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Głosy według płci",
      },
    },
    maintainAspectRatio: false,
    aspectRatio: 0.7,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  const clubVotesData = {
    labels: voting.club_votes.map((cv: any) => cv.club.id),
    datasets: [
      {
        label: "Za",
        data: voting.club_votes.map((cv: any) => cv.yes),
        backgroundColor: "#10B981",
      },
      {
        label: "Przeciw",
        data: voting.club_votes.map((cv: any) => cv.no),
        backgroundColor: "#EF4444",
      },
      {
        label: "Brak głosu",
        data: voting.club_votes.map((cv: any) => cv.abstain),
        backgroundColor: "#F59E0B",
      },
    ],
  };

  const voteColumns = [
    { accessorKey: "MP", header: "Poseł" },
    { accessorKey: "vote", header: "Głos" },
  ];

  const clubVotesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Głosowanie ze względu na klub parlamentarny",
      },
    },
    maintainAspectRatio: false,
    aspectRatio: 0.7,
  };

  return (
    <div className="container mx-auto p-4 md:p-8 sm:p-0 sm:px-0 space-y-8">
      <h1 className="text-3xl font-bold">{voting.topic}</h1>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="w-6 h-6 mr-2" />
            Podsumowanie
          </CardTitle>
        </CardHeader>
        <CardContent>
          {voting.summary && (
            <p>
              <strong>Tytuł:</strong> {voting.summary}
            </p>
          )}
          {voting.topic && (
            <p>
              <strong>Opis:</strong> {voting.topic}
            </p>
          )}
          <p className="space-x-3 mt-4">
            <Badge>
              {voting.success ? "Przegłosowano" : "Nie przegłosowano"}
            </Badge>
            <Badge variant="secondary">{voting.category}</Badge>
            <Badge variant="secondary">Rodzaj: {voting.kind}</Badge>
          </p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-6 h-6 mr-2" />
              Głosowanie ze względu na klub parlamentarny
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-64">
            <Bar data={clubVotesData}  options={clubVotesOptions}/>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-6 h-6 mr-2" />
              Wyniki głosowania
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Pie data={totalVotesData} />
          </CardContent>
        </Card>
        <Card className="md:col-span-3 p-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Głosy posłów
            </CardTitle>
          </CardHeader>
          <CardContent className=" overflow-x-hidden">
            <DataTable columns={voteColumns} data={voting.votes} filters={[]} rowsPerPage={2} />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-6 h-6 mr-2" />
              Głosy według płci
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-64">
            <Bar data={genderVotesData} options={genderVotesOptions} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Powiązane druki
          </CardTitle>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
      )}
    </div>
  );
};

export default VotingDetail;
