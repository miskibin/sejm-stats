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
  ExternalLink,
  FileText,
  Users,
  Briefcase,
  FileQuestion,
  Book,
  Vote,
} from "lucide-react";
import {
  CommitteeSitting,
  Interpellation,
  Process,
  Print,
  Act,
  Voting,
} from "@/lib/types";

interface SearchResultsData {
  committee_sittings?: CommitteeSitting[];
  interpellations?: Interpellation[];
  processes?: Process[];
  prints?: Print[];
  acts?: Act[];
  votings?: Voting[];
  [key: string]: any;
}

const tabConfig = [
  { key: "committee_sittings", label: "Posiedzenia komisji", Icon: Users },
  { key: "interpellations", label: "Interpelacje", Icon: FileQuestion },
  { key: "processes", label: "Procesy", Icon: Briefcase },
  { key: "prints", label: "Druki", Icon: FileText },
  { key: "acts", label: "Akty prawne", Icon: Book },
  { key: "votings", label: "Głosowania", Icon: Vote },
];

const SearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString();
  const query = searchParams?.get("q") || "";
  const { data, isLoading, error } = useFetchData<SearchResultsData>(
    `/search?${queryString}`
  );

  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  const totalResults = Object.values(data).reduce(
    (acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0),
    0
  );

  const availableTabs = tabConfig.filter(
    (tab) => data[tab.key] && data[tab.key].length > 0
  );
  const defaultTab = availableTabs[0]?.key || "";

  const displayQuery = query
    .split(",")
    .map((word) => word.trim())
    .join(", ");
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">
            Wyniki wyszukiwania dla {query.includes(",") ? "haseł" : "hasła"}:
            <span className="font-bold ml-2">{displayQuery}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-4">Znaleziono {totalResults} wyników</p>
        </CardContent>
      </Card>

      {availableTabs.length > 0 ? (
        <Tabs defaultValue={defaultTab}>
          <TabsList className="flex flex-wrap justify-around lg:justify-start gap-2 mb-4">
            {availableTabs.map(({ key, label, Icon }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center justify-center px-2 py-1 sm:px-4 sm:py-2"
              >
                <Icon className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">{label}</span>
                <span className="ml-1">({data[key]?.length ?? 0})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {data.committee_sittings && data.committee_sittings.length > 0 && (
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
          )}

          {data.interpellations && data.interpellations.length > 0 && (
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
          )}

          {data.processes && data.processes.length > 0 && (
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
          )}

          {data.prints && data.prints.length > 0 && (
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
          )}

          {data.acts && data.acts.length > 0 && (
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
          )}

          {data.votings && data.votings.length > 0 && (
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
                        <span className="font-semibold">
                          Przeciw: {voting.no}
                        </span>
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
          )}
        </Tabs>
      ) : (
        <Card>
          <CardContent>
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              Brak wyników dla podanego zapytania.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;
