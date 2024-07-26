"use client";
import { useEffect, useState } from "react";
import LoadableContainer from "@/components/loadableContainer";
import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import { MultiSelect } from "@/components/ui/multiSelect";
import Footer from "@/components/ui/stepper-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmButton from "@/components/ui/confirm";

interface MetaItem {
  name: string;
  label: string;
  count: number;
}

interface VotingsMeta {
  categories: MetaItem[];
  kinds: MetaItem[];
  years: MetaItem[];
}

const steps: StepItem[] = [
  { label: "Kategorie", optional: true },
  { label: "Rodzaje głosowań", optional: true },
  { label: "Lata", optional: true },
  { label: "Podsumowanie" },
];

export default function VotingStepperDemo() {
  const [votingsMeta, setVotingsMeta] = useState<VotingsMeta>({
    categories: [],
    kinds: [],
    years: [],
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/votings-meta/");
        const data = await response.json();
        setVotingsMeta(data);
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
          <Step label="Kategorie">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={votingsMeta.categories.map(
                    (c) => `${c.label} (${c.count})`
                  )}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Wybierz kategorie"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Rodzaje głosowań">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={votingsMeta.kinds.map(
                    (k) => `${k.label} (${k.count})`
                  )}
                  selected={selectedKinds}
                  onChange={setSelectedKinds}
                  placeholder="Wybierz rodzaje głosowań"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Lata">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={votingsMeta.years.map(
                    (y) => `${y.name} (${y.count})`
                  )}
                  selected={selectedYears}
                  onChange={setSelectedYears}
                  placeholder="Wybierz lata"
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
                        Kategorie ({selectedCategories.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.map((item) => (
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
                        Rodzaje głosowań ({selectedKinds.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedKinds.map((item) => (
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
                        Lata ({selectedYears.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedYears.map((item) => (
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
                  url="votings-results"
                  selectedCategories={selectedCategories}
                  selectedKinds={selectedKinds}
                  selectedYears={selectedYears}
                />
              </div>
            </div>
          </Step>
        </Stepper>
      </LoadableContainer>
    </div>
  );
}
