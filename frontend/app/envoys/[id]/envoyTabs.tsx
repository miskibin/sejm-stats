import React from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnvoyDetail } from "@/lib/types";

interface EnvoyTabsProps {
  envoy: EnvoyDetail;
}

const EnvoyTabs: React.FC<EnvoyTabsProps> = ({ envoy }) => {
  return (
    <Tabs defaultValue="votings" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="votings">Głosowania</TabsTrigger>
        <TabsTrigger value="projects">Projekty</TabsTrigger>
        <TabsTrigger value="interpellations">Interpelacje</TabsTrigger>
      </TabsList>
      <TabsContent value="votings">
        <Card>
          <CardContent className="p-6">
            {envoy.latest_votings.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {envoy.latest_votings.map((voting) => (
                    <li key={voting.id} className="border-b pb-2">
                      <Link href={`/votings/${voting.id}`} className="hover:underline">
                        <p className="font-semibold">{voting.title}</p>
                      </Link>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{new Date(voting.date).toLocaleDateString("pl-PL")}</span>
                        <Badge
                          variant={
                            voting.envoy_vote === "Za"
                              ? "success"
                              : voting.envoy_vote === "Przeciw"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {voting.envoy_vote}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" disabled>
                  Pokaż wszystkie
                </Button>
              </>
            ) : (
              <p>Brak głosowań.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="projects">
        <Card>
          <CardContent className="p-6">
            {envoy.processes.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {envoy.processes.map((process) => (
                    <li key={process.id} className="border-b pb-2">
                      <Link href={`/processes/${process.id}`} className="hover:underline">
                        <p className="font-semibold">{process.title}</p>
                      </Link>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{process.documentDate}</span>
                        <Badge>{process.length_tag}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" disabled>
                  Pokaż wszystkie
                </Button>
              </>
            ) : (
              <p>Brak projektów.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="interpellations">
        <Card>
          <CardContent className="p-6">
            {envoy.interpellations.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {envoy.interpellations.map((interpellation) => (
                    <li key={interpellation.id} className="border-b pb-2">
                      {interpellation.bodyLink ? (
                        <Link
                          href={interpellation.bodyLink}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="font-semibold">{interpellation.title}</p>
                        </Link>
                      ) : (
                        <p className="font-semibold">{interpellation.title}</p>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {new Date(interpellation.lastModified).toLocaleDateString("pl-PL")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" disabled>
                  Pokaż wszystkie
                </Button>
              </>
            ) : (
              <p>Brak interpelacji.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EnvoyTabs;