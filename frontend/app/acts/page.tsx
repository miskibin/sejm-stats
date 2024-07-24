"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockKeywords = [
  { id: 1, name: "Environment" },
  { id: 2, name: "Education" },
  { id: 3, name: "Healthcare" },
  { id: 4, name: "Economy" },
  { id: 5, name: "Technology" },
];

const mockPublishers = [
  { id: 1, name: "Government Press" },
  { id: 2, name: "Ministry of Justice" },
  { id: 3, name: "Parliament Publications" },
  { id: 4, name: "Supreme Court" },
];

const steps = [
  { title: "Keywords", description: "Select relevant keywords" },
  { title: "Publisher", description: "Choose a publisher" },
  { title: "Date Range", description: "Set the date range" },
];

const ActFilter: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [open, setOpen] = useState(false);

  const handleKeywordToggle = (keywordId: number) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((id) => id !== keywordId)
        : [...prev, keywordId]
    );
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    console.log({
      keywords: selectedKeywords,
      publisher: selectedPublisher,
      dateRange,
    });
    // Here you would typically send this data to a parent component or make an API call
  };

  return (
    <div className="w-[600px] mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Filter Acts</h2>

      {/* Stepper */}
      <div className="mb-8">
        <ol className="flex items-center w-full">
          {steps.map((s, index) => (
            <li
              key={index}
              className={`flex w-full items-center ${
                index < steps.length - 1
                  ? 'after:content-[""] after:w-full after:h-1 after:border-b after:border-4 after:inline-block'
                  : ""
              } ${
                step > index + 1
                  ? "after:border-blue-600"
                  : "after:border-gray-200"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 ${
                  step > index + 1
                    ? "bg-blue-600"
                    : step === index + 1
                    ? "bg-blue-600"
                    : "bg-gray-200"
                } rounded-full shrink-0`}
              >
                {step > index + 1 ? (
                  <Check className="w-5 h-5  text-white" />
                ) : (
                  <span
                    className={`text-sm ${
                      step === index + 1 ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </span>
              <span className="ml-2">
                <h3
                  className={`text-sm font-medium px-2 ${
                    step >= index + 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {s.title}
                </h3>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Keywords</h3>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedKeywords.length > 0
                  ? `${selectedKeywords.length} selected`
                  : "Select keywords..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search keywords..." />
                <CommandEmpty>No keyword found.</CommandEmpty>
                <CommandGroup>
                  {mockKeywords.map((keyword) => (
                    <CommandItem
                      key={keyword.id}
                      onSelect={() => handleKeywordToggle(keyword.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedKeywords.includes(keyword.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {keyword.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Publisher</h3>
          <Select onValueChange={setSelectedPublisher}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a publisher" />
            </SelectTrigger>
            <SelectContent>
              {mockPublishers.map((publisher) => (
                <SelectItem key={publisher.id} value={publisher.id.toString()}>
                  {publisher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Date Range</h3>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border"
          />
        </div>
      )}

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <Button onClick={handleBack} variant="outline">
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={handleNext} className="ml-auto">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="ml-auto">
            Apply Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActFilter;
