"use client";
import { useEffect, useState } from "react";
import LoadableContainer from "@/components/loadableContainer";
import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import { MultiSelect } from "@/components/ui/multiSelect";
import Footer from "@/components/ui/stepper-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmButton from "@/components/ui/confirm";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface MetaItem {
  name: string;
  label: string;
  count: number;
}

interface VotingsMeta {
  categories: MetaItem[];
  kinds: MetaItem[];
}

const steps: StepItem[] = [
  { label: "Kategorie", optional: true },
  { label: "Zakres dat", optional: true },
  { label: "Podsumowanie" },
];

export default function VotingStepperDemo() {
  const [votingsMeta, setVotingsMeta] = useState<VotingsMeta>({
    categories: [],
    kinds: [],
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votings-meta/`);
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
    <div className="mx-auto max-w-4xl p-1">
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
         
          <Step label="Zakres dat">
            <div className="my-4">
              <DatePickerWithRange
                className="w-full"
                date={dateRange}
                setDate={setDateRange}
              />
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
                        Zakres dat
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {dateRange?.from && (
                          <Badge variant="secondary" className="text-xs">
                            {format(dateRange.from, "dd.MM.yyyy")}
                          </Badge>
                        )}
                        {dateRange?.to && (
                          <>
                            <span className="mx-1">-</span>
                            <Badge variant="secondary" className="text-xs">
                              {format(dateRange.to, "dd.MM.yyyy")}
                            </Badge>
                          </>
                        )}
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
                  selectedStart_date={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined}
                  selectedEnd_date={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined}
                />
              </div>
            </div>
          </Step>
        </Stepper>
      </LoadableContainer>
    </div>
  );
}