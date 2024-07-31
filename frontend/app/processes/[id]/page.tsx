"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadableContainer from "@/components/loadableContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, FileText, Users, Calendar, Info } from "lucide-react";
import { Envoy } from "@/lib/types";
import Link from "next/link";
import GroupedMPs from "./groupedEnvoys";

const ProcessDetail: React.FC = () => {
  const [process, setProcess] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/processes/${id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch process details");
        const data = await response.json();
        setProcess(data);
      } catch (err) {
        setError("An error occurred while fetching the process details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProcess();
  }, [id]);

  if (isLoading) return <LoadableContainer>Ładowanie...</LoadableContainer>;
  if (error) return <LoadableContainer>{error}</LoadableContainer>;
  if (!process)
    return <LoadableContainer>Nie znaleziono procesu.</LoadableContainer>;

  return (
    <div className="container mx-auto md:max-2xl:p-16 max-w-7xl">
      <Card className="my-6">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-6">{process.title}</h1>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="mr-2" /> Podstawowe informacje
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong> {process.is_finished}
              </p>
              <p>
                <strong>Numer:</strong> {process.number}
              </p>
              <p>
                <strong>Kadencja:</strong> {process.term}
              </p>
              <p>
                <strong>Data zmiany:</strong> {process.changeDate}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" /> Szczegóły dokumentu
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Typ:</strong> {process.documentType}
              </p>
              <p>
                <strong>Długość:</strong> {process.length_tag} (
                {process.pagesCount} stron)
              </p>
              <p>
                <strong>Złożony przez:</strong>{" "}
                {process.createdBy || "Nie określono"}
              </p>
              <p>
                <strong>Data wniesienia:</strong> {process.documentDate}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {process.description !== "Brak" && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Opis</h2>
            <p>{process.description}</p>
          </CardContent>
        </Card>
      )}

      {process.prints && process.prints.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2" /> Powiązane druki
            </h2>
            <ul className="space-y-2">
              {process.prints.map((print: any) => (
                <li key={print.id}>
                  <a
                    href={print.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {print.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {process.stages && process.stages.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2" /> Etapy procesu
            </h2>
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {process.stages.map((stage, index) => (
                <li key={stage.stageNumber} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <span className="text-blue-800 dark:text-blue-300">
                      {index + 1}
                    </span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {stage.stageName}
                    {stage.result === "PASS" && (
                      <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 ml-3">
                        Zatwierdzono
                      </span>
                    )}
                    {stage.result === "FAIL" && (
                      <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300 ml-3">
                        Odrzucono
                      </span>
                    )}
                  </h3>
                  {stage.date && (
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {stage.date}
                    </time>
                  )}
                  {stage.comment && (
                    <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                      {stage.comment}
                    </p>
                  )}
                  {stage.decision && (
                    <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                      {stage.decision}
                    </p>
                  )}
                  {stage.voting && (
                    <Link
                      href={`/votings/${stage.voting.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      Głosowanie: {stage.voting.title}{" "}
                      <svg
                        className="w-3 h-3 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <GroupedMPs mps={process.MPs} />
    </div>
  );
};

export default ProcessDetail;
