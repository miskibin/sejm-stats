"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import LoadableContainer from "@/components/loadableContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CommitteeMember, CommitteeResponse } from "@/lib/types";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import { useFetchData } from "@/lib/api";

const CommitteeDetail: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { code } = useParams<{ code: string }>() || { code: "" };

  const { data, isLoading, error } = useFetchData<CommitteeResponse>(
    `/committees/${code}/`
  );
  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;
  const committee = data;

  const groupedMembers = committee.members.reduce((acc, member) => {
    if (!acc[member.envoy_club]) {
      acc[member.envoy_club] = [];
    }
    acc[member.envoy_club].push(member);
    return acc;
  }, {} as { [key: string]: CommitteeMember[] });

  const toggleSection = (club: string) => {
    setOpenSections((prev) => ({ ...prev, [club]: !prev[club] }));
  };

  return (
    <div className="container mx-auto md:max-2xl:p-16 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">{committee.name}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2" /> Informacje o komisji
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Kod:</strong> {committee.code}
              </p>
              <p>
                <strong>Typ:</strong> {committee.type}
              </p>
              <p>
                <strong>Data powołania:</strong> {committee.appointmentDate}
              </p>
              <p>
                <strong>Data składu:</strong> {committee.composition_date}
              </p>
            </div>
            <div>
              <p>
                <strong>Telefon:</strong> {committee.phone}
              </p>
            </div>
          </div>
          {committee.scope && (
            <>
              <Separator className="my-4" />
              <h3 className="font-semibold mb-2">Zakres działania</h3>
              <p>{committee.scope}</p>
            </>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="members" className="mb-8">
        <TabsList>
          <TabsTrigger value="members">Członkowie komisji</TabsTrigger>
          <TabsTrigger value="meetings">Ostatnie posiedzenia</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <Card>
            <CardContent className="p-6">
              {Object.entries(groupedMembers).map(([club, members]) => (
                <Collapsible
                  key={club}
                  className="mb-4"
                  open={openSections[club]}
                  onOpenChange={() => toggleSection(club)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-md">
                    <span className="font-semibold">
                      {club} ({members.length})
                    </span>
                    {openSections[club] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {members.map((member) => (
                        <div key={member.envoy_id} className="flex flex-col">
                          <div className="flex items-center">
                            <Link
                              href={`/envoys/${member.envoy_id}`}
                              className="text-blue-500 hover:underline"
                            >
                              {member.envoy_name}
                            </Link>
                            {member.function && (
                              <Badge variant="secondary" className="ml-2">
                                {member.function}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="meetings">
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {committee.recent_sittings.map((sitting, index) => (
                  <AccordionItem key={sitting.id} value={`item-${index}`}>
                    <AccordionTrigger>
                      Posiedzenie nr {sitting.num} - {sitting.date}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">{sitting.agenda}</p>
                      <div className="flex space-x-4 mt-4">
                        {sitting.video_url && (
                          <a
                            href={sitting.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Nagranie wideo
                          </a>
                        )}
                        {sitting.pdf_transcript && (
                          <a
                            href={sitting.pdf_transcript}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Stenogram PDF
                          </a>
                        )}
                      </div>
                      {sitting.prints && sitting.prints.length > 0 && (
                        <div className="mt-4">
                          <strong>Powiązane druki:</strong>
                          <ul className="list-disc list-inside mt-2">
                            {sitting.prints.map((print) => (
                              <li key={print.id}>
                                <a
                                  href={print.pdf_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {print.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommitteeDetail;