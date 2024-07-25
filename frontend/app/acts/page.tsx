"use client";
import { useEffect, useState } from "react";
import LoadableContainer from "@/components/loadableContainer";
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/ui/stepper";
import { MultiSelect } from "@/components/ui/multiSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/ui/footer";

const steps = [
  { label: "Wydawcy" },
  { label: "Słowa kluczowe", optional: true },
  { label: "Status aktu" },
  { label: "Instytucje" },
  { label: "Podsumowanie" },
] satisfies StepItem[];

interface ActsMeta {
  publishers: string[];
  keywords: string[];
  actStatuses: string[];
  institutions: string[];
}

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
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
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
        <div className="flex w-full flex-col gap-4">
          <Stepper
            initialStep={0}
            steps={steps}
            orientation="vertical"
            variant="circle-alt"
            size="lg"
          >
            <Step label="Wydawcy">
              <div className="my-4">
                {isLoading ? (
                  <div>Ładowanie...</div>
                ) : (
                  <MultiSelect
                    options={actsMeta.publishers}
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
                    options={actsMeta.keywords}
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
                    options={actsMeta.actStatuses}
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
                    options={actsMeta.institutions}
                    selected={selectedInstitutions}
                    onChange={setSelectedInstitutions}
                    placeholder="Wybierz instytucje"
                  />
                )}
              </div>
              <Footer />
            </Step>
            <Step label="Podsumowanie">
              <div className="my-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Wybrani wydawcy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPublishers.length === 0 ? (
                      <p className="text-gray-500 italic">Nie wybrano żadnych wydawców</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedPublishers.map((publisher) => (
                          <Badge key={publisher} variant="secondary">
                            {publisher}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wybrane słowa kluczowe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedKeywords.length === 0 ? (
                      <p className="text-gray-500 italic">Nie wybrano żadnych słów kluczowych</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedKeywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wybrane statusy aktów</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStatuses.length === 0 ? (
                      <p className="text-gray-500 italic">Nie wybrano żadnych statusów</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedStatuses.map((status) => (
                          <Badge key={status} variant="secondary">
                            {status}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wybrane instytucje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedInstitutions.length === 0 ? (
                      <p className="text-gray-500 italic">Nie wybrano żadnych instytucji</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedInstitutions.map((institution) => (
                          <Badge key={institution} variant="secondary">
                            {institution}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Podsumowanie wyboru</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Liczba wybranych wydawców: <span className="font-semibold">{selectedPublishers.length}</span></p>
                    <p>Liczba wybranych słów kluczowych: <span className="font-semibold">{selectedKeywords.length}</span></p>
                    <p>Liczba wybranych statusów: <span className="font-semibold">{selectedStatuses.length}</span></p>
                    <p>Liczba wybranych instytucji: <span className="font-semibold">{selectedInstitutions.length}</span></p>
                  </CardContent>
                </Card>
              </div>
              <Footer />
            </Step>
          </Stepper>
        </div>
      </LoadableContainer>
    </div>
  );
}
