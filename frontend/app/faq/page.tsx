"use client";

import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Crown } from "lucide-react";
import LoadableContainer from "@/components/loadableContainer";
import { FAQItem, FaqViewAPIResponse, TeamMember } from "@/lib/types";
import { useFetchData } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/spinner";

const FAQAndTeamPage: React.FC = () => {
  const { data, isLoading, error } = useFetchData<FaqViewAPIResponse>("/faq/");
  if (isLoading) return <LoadingSpinner />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;
  let faqs = data.faqs.results;
  let teamMembers = data.team_members;
  const teamCore = teamMembers.filter(
    (member) =>
      member.role === "Twórca aplikacji" || member.role === "Programista"
  );
  const supporters = teamMembers.filter((member) =>
    member.role.toLowerCase().includes("wspierający")
  );

  return (
    <div className="container mx-auto p-2 md:p-8 max-w-6xl">
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="team">Zespół</TabsTrigger>
        </TabsList>
        <TabsContent value="faq">
          <h1 className="text-3xl font-bold mb-8">Często Zadawane Pytania</h1>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq: FAQItem, index: number) => (
              <AccordionItem key={faq.id} value={`item-${index}`}>
                <AccordionTrigger className="text-xl font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  {(faq.url1 || faq.url2) && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Przydatne linki:
                      </h3>
                      <ul className="list-disc list-inside">
                        {faq.url1 && (
                          <li>
                            <a
                              href={faq.url1}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Link 1
                            </a>
                          </li>
                        )}
                        {faq.url2 && (
                          <li>
                            <a
                              href={faq.url2}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Link 2
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="team">
          <h1 className="text-3xl font-bold mb-8">Nasz Zespół</h1>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Zespół</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamCore.map((member: TeamMember) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                    <p className="text-sm">Od: {member.since}</p>
                    {member.about && <p className="mt-2">{member.about}</p>}
                    {member.facebook_url && (
                      <a
                        href={member.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center mt-2"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Facebook
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Wspierają nas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supporters.map((member: TeamMember) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {member.name}
                      {member.role === "Wyjątkowo chojny wspierający" && (
                        <Crown className="w-5 h-5 ml-2 text-yellow-600" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Od: {member.since}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQAndTeamPage;
