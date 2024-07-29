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
  label?: string;
  count: number;
}

interface ProcessesMeta {
  createdBy: MetaItem[];
  documentTypes: MetaItem[];
  years: MetaItem[];
  lengthTags: MetaItem[];
  clubs: MetaItem[];
}

const steps: StepItem[] = [
  { label: "Autor", optional: true },
  { label: "Typ dokumentu", optional: true },
  { label: "Kluby", optional: true },
  { label: "Zakres dat", optional: true },
  { label: "Podsumowanie" },
];

export default function ProcessStepperDemo() {
  const [processesMeta, setProcessesMeta] = useState<ProcessesMeta>({
    createdBy: [],
    documentTypes: [],
    years: [],
    lengthTags: [],
    clubs: [],
  });
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string[]>([]);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>([]);
  const [selectedLengthTags, setSelectedLengthTags] = useState<string[]>([]);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/processes-meta/");
        const data = await response.json();
        setProcessesMeta(data);
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
          <Step label="Autor">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={processesMeta.createdBy.map(
                    (c) => `${c.name|| "Nieznany"} (${c.count})`
                  )}
                  selected={selectedCreatedBy}
                  onChange={setSelectedCreatedBy}
                  placeholder="Wybierz autora"
                />
              )}
            </div>
            <Footer />
          </Step>
          <Step label="Typ dokumentu">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={processesMeta.documentTypes.map(
                    (d) => `${d.name} (${d.count})`
                  )}
                  selected={selectedDocumentTypes}
                  onChange={setSelectedDocumentTypes}
                  placeholder="Wybierz typ dokumentu"
                />
              )}
            </div>
            <Footer />
          </Step>
         
          <Step label="Kluby">
            <div className="my-4">
              {isLoading ? (
                <div>Ładowanie...</div>
              ) : (
                <MultiSelect
                  options={processesMeta.clubs.map(
                    (c) => `${c.name} (${c.count})`
                  )}
                  selected={selectedClubs}
                  onChange={setSelectedClubs}
                  placeholder="Wybierz kluby"
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
                        Autor ({selectedCreatedBy.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedCreatedBy.map((item) => (
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
                        Typ dokumentu ({selectedDocumentTypes.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedDocumentTypes.map((item) => (
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
                        Długość ({selectedLengthTags.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedLengthTags.map((item) => (
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
                        Kluby ({selectedClubs.length})
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedClubs.map((item) => (
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
                  url="processes-results"
                  selectedCreatedBy={selectedCreatedBy}
                  selectedDocumentTypes={selectedDocumentTypes}
                  selectedLengthTags={selectedLengthTags}
                  selectedClubs={selectedClubs}
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