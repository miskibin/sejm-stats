"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import LoadableContainer from "@/components/loadableContainer";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Calendar,
  Info,
  ExternalLink,
  BarChart2,
  PieChart,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import useChartDefaults from "@/utils/chartDefaults";
import {
  CommitteeSitting,
  Interpellation,
  Process,
  Print,
  Act,
  Voting,
} from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SearchResultsData {
  committee_sittings: CommitteeSitting[];
  interpellations: Interpellation[];
  processes: Process[];
  prints: Print[];
  acts: Act[];
  votings: Voting[];
}

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q");
  const range = searchParams?.get("range");
  const end_date = new Date().toISOString().split("T")[0];
  let start_date;
  if (range === "1m") {
    start_date = new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0];
  } else if (range === "3m") {
    start_date = new Date(new Date().setMonth(new Date().getMonth() - 3))
      .toISOString()
      .split("T")[0];
  }
  const { data, isLoading, error } = useFetchData<SearchResultsData>(
    `/search?q=${query}${start_date ? `&start_date=${start_date}` : ""}${
      end_date ? `&end_date=${end_date}` : ""
    }`
  );

  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  const totalResults = Object.values(data).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">
            Wyniki wyszukiwania dla "{query}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-4">Znaleziono {totalResults} wyników</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="committee_sittings">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="committee_sittings">
            Posiedzenia komisji ({data.committee_sittings.length})
          </TabsTrigger>
          <TabsTrigger value="interpellations">Interpelacje ({data.interpellations.length})</TabsTrigger>
          <TabsTrigger value="processes">Procesy ({data.processes.length})</TabsTrigger>
          <TabsTrigger value="prints">Druki ({data.prints.length})</TabsTrigger>
          <TabsTrigger value="acts">Akty prawne ({data.acts.length})</TabsTrigger>
          <TabsTrigger value="votings">Głosowania ({data.votings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="committee_sittings">
          <Card>
            <CardHeader>
              <CardTitle>Posiedzenia komisji</CardTitle>
            </CardHeader>
            <CardContent>
              {data.committee_sittings.map((sitting) => (
                <div
                  key={sitting.id}
                  className="mb-4 p-4 border rounded hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/committee-sittings/${sitting.id}`}
                    className="text-gray-900 dark:text-gray-100 hover:underline text-lg font-semibold"
                  >
                    {sitting.agenda.substring(0, 100)}...
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Data: {sitting.date}
                  </p>
                  {sitting.prints.length > 0 && (
                    <div className="mt-2">
                      <strong>Powiązane druki:</strong>
                      <ul className="list-disc list-inside">
                        {sitting.prints.map((print) => (
                          <li key={print.id}>
                            <a
                              href={print.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 dark:text-gray-300 hover:underline"
                            >
                              {print.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interpellations">
          <Card>
            <CardHeader>
              <CardTitle>Interpelacje</CardTitle>
            </CardHeader>
            <CardContent>
              {data.interpellations.map((interpellation) => (
                <div
                  key={interpellation.id}
                  className="mb-4 p-4 border rounded hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/interpellations/${interpellation.id}`}
                    className="text-gray-900 dark:text-gray-100 hover:underline text-lg font-semibold"
                  >
                    {interpellation.title}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Data wysłania: {interpellation.sentDate}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processes">
          <Card>
            <CardHeader>
              <CardTitle>Procesy</CardTitle>
            </CardHeader>
            <CardContent>
              {data.processes.map((process) => (
                <div
                  key={process.id}
                  className="mb-4 p-4 border rounded hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/processes/${process.id}`}
                    className="text-gray-900 dark:text-gray-100 hover:underline text-lg font-semibold"
                  >
                    {process.title}
                  </Link>
                  <div className="flex items-center mt-2">
                    <Badge className="mr-2">{process.length_tag}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Data dokumentu: {process.documentDate}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prints">
          <Card>
            <CardHeader>
              <CardTitle>Druki</CardTitle>
            </CardHeader>
            <CardContent>
              {data.prints.map((print) => (
                <div
                  key={print.id}
                  className="mb-4 p-4 border rounded hover:shadow-md transition-shadow"
                >
                  <a
                    href={print.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-gray-100 hover:underline text-lg font-semibold flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {print.title}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acts">
          <Card>
            <CardHeader>
              <CardTitle>Akty prawne</CardTitle>
            </CardHeader>
            <CardContent>
              {data.acts.map((act) => (
                <div
                  key={act.ELI}
                  className="mb-4 p-4 border rounded hover:shadow-md transition-shadow"
                >
                  <a
                    href={act.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-gray-100 hover:underline text-lg font-semibold"
                  >
                    {act.title}
                  </a>
                  <div className="flex items-center mt-2">
                    <Badge className="mr-2">{act.status}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Data ogłoszenia: {act.announcementDate}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="votings">
          <Card>
            <CardHeader>
              <CardTitle>Głosowania</CardTitle>
            </CardHeader>
            <CardContent>
              {data.votings.map((voting) => (
                <div
                  key={voting.id}
                  className="mb-4 p-4 border rounded hover:shadow-md transition-shadow"
                >
                  <Link
                    href={`/votings/${voting.id}`}
                    className="text-gray-900 dark:text-gray-100 hover:underline text-lg font-semibold"
                  >
                    {voting.title}
                  </Link>
                  <div className="flex items-center mt-2">
                    <Badge
                      className={`mr-2 ${
                        voting.success ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {voting.success ? "Przyjęto" : "Odrzucono"}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Data: {voting.date}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="font-semibold">Za: {voting.yes}</span>
                    <span className="mx-2">|</span>
                    <span className="font-semibold">Przeciw: {voting.no}</span>
                    <span className="mx-2">|</span>
                    <span className="font-semibold">
                      Wstrzymało się: {voting.abstain}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults;
