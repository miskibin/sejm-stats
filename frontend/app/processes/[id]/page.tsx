"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadableContainer from "@/components/loadableContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, FileText, Users, Calendar, Info } from "lucide-react";
import { Envoy } from "@/lib/types";

const ProcessDetail: React.FC = () => {
  const [process, setProcess] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/processes/${id}/`);
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
  if (!process) return <LoadableContainer>Nie znaleziono procesu.</LoadableContainer>;

  return (
      <div className="container mx-auto md:max-2xl:p-16 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">{process.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="mr-2" /> Podstawowe informacje
              </h2>
              <div className="space-y-2">
                <p><strong>Status:</strong> {process.is_finished}</p>
                <p><strong>Numer:</strong> {process.number}</p>
                <p><strong>Kadencja:</strong> {process.term}</p>
                <p><strong>Data zmiany:</strong> {process.changeDate}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2" /> Szczegóły dokumentu
              </h2>
              <div className="space-y-2">
                <p><strong>Typ:</strong> {process.documentType}</p>
                <p><strong>Długość:</strong> {process.length_tag} ({process.pagesCount} stron)</p>
                <p><strong>Złożony przez:</strong> {process.createdBy || 'Nie określono'}</p>
                <p><strong>Data wniesienia:</strong> {process.documentDate}</p>
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
                    <a href={print.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
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
              <ul className="space-y-6">
                {process.stages.map((stage: any) => (
                  <li key={stage.stageNumber} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg">{stage.stageName}</h3>
                    {stage.date && <p className="text-sm text-gray-600 mt-1">{stage.date}</p>}
                    {stage.comment && <p className="mt-2">{stage.comment}</p>}
                    {stage.decision && (
                      <p className="mt-2">
                        {stage.decision}
                        {stage.result === "PASS" && <span className="text-green-500 ml-2">✓</span>}
                        {stage.result === "FAIL" && <span className="text-red-500 ml-2">✗</span>}
                      </p>
                    )}
                    {stage.voting && (
                      <p className="mt-2">
                        <a href={`/votings/${stage.voting.id}`} className="text-blue-500 hover:underline">
                          Głosowanie: {stage.voting.title}
                        </a>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {process.MPs && process.MPs.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2" /> Posłowie
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {process.MPs.map((envoy: Envoy) => (
                  <li key={`${envoy.firstName}-${envoy.lastName}`} className="space-y-1">
                    <p className="font-semibold">{envoy.firstName} {envoy.lastName}</p>
                    <p className="text-sm">{envoy.club}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
  );
};

export default ProcessDetail;