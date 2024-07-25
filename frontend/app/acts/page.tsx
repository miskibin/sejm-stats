"use client";
import { useEffect, useState } from "react";
import LoadableContainer from "@/components/loadableContainer";
import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import { MultiSelect } from "@/components/ui/multiSelect";
import Footer from "@/components/ui/stepper-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import router from "next/router";
import ConfirmButton from "./confirm";

interface MetaItem {
  name: string;
  count: number;
}

interface ActsMeta {
  publishers: MetaItem[];
  keywords: MetaItem[];
  actStatuses: MetaItem[];
  institutions: MetaItem[];
}

const steps: StepItem[] = [
  { label: "Wydawcy", optional: true },
  { label: "Słowa kluczowe", optional: true },
  { label: "Status aktu", optional: true },
  { label: "Instytucje", optional: true },
  { label: "Podsumowanie" },
];


export default function StepperDemo() {
  const [actsMeta, setActsMeta] = useState<ActsMeta>({
    publishers: [],
    keywords: [],
    actStatuses: [],
    institutions: [],
  });
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/acts-meta/");
        const data = await response.json();
        setActsMeta(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <LoadableContainer>
        <Stepper
          initialStep={0}
          steps={steps}
          orientation="horizontal"
          variant="circle-alt"
        >
          <Step label="Wydawcy">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={actsMeta.publishers.map(
                    (p) => `${p.name} (${p.count})`
                  )}
                  selected={selectedPublishers}
                  onChange={setSelectedPublishers}
                  placeholder="Wybierz wydawców"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Słowa kluczowe">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={actsMeta.keywords.map(
                    (k) => `${k.name} (${k.count})`
                  )}
                  selected={selectedKeywords}
                  onChange={setSelectedKeywords}
                  placeholder="Wybierz słowa kluczowe"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Status aktu">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={actsMeta.actStatuses.map(
                    (s) => `${s.name} (${s.count})`
                  )}
                  selected={selectedStatuses}
                  onChange={setSelectedStatuses}
                  placeholder="Wybierz status aktu"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Instytucje">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={actsMeta.institutions.map(
                    (i) => `${i.name} (${i.count})`
                  )}
                  selected={selectedInstitutions}
                  onChange={setSelectedInstitutions}
                  placeholder="Wybierz instytucje"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Podsumowanie">
            <div className="my-4">
              <Card>
                <CardHeader>
                  <CardTitle>Podsumowanie wyboru</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Wydawcy ({selectedPublishers.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedPublishers.map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.split(" (")[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Słowa kluczowe ({selectedKeywords.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedKeywords.map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.split(" (")[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Statusy aktów ({selectedStatuses.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedStatuses.map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.split(" (")[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">
                        Instytucje ({selectedInstitutions.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedInstitutions.map((item) => (
                          <Badge
                            key={item}
                            variant="secondary"
                            className="text-xs"
                          >
                            {item.split(" (")[0]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 flex justify-end">
                <ConfirmButton
                  selectedPublishers={selectedPublishers}
                  selectedKeywords={selectedKeywords}
                  selectedStatuses={selectedStatuses}
                  selectedInstitutions={selectedInstitutions}
                />
              </div>
            </div>
          </Step>
        </Stepper>
      </LoadableContainer>
    </div>
  );
}
