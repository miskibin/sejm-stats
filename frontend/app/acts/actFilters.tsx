"use client"
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface Keyword {
  id: number;
  name: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface ActFilterProps {
  onFilterChange: (filters: {
    keywords: number[];
    publisher: number | null;
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}

const ActFilter: React.FC<ActFilterProps> = ({ onFilterChange }) => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [selectedPublisher, setSelectedPublisher] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch keywords and publishers from your API
    const fetchData = async () => {
      // Replace these with actual API calls
      const keywordsData = await fetch("http://127.0.0.1:8000/api/keywords").then((res) =>
        res.json()
      );
      const publishersData = await fetch("http://127.0.0.1:8000/api/publishers").then((res) =>
        res.json()
      );
      setKeywords(keywordsData);
      setPublishers(publishersData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    onFilterChange({
      keywords: selectedKeywords,
      publisher: selectedPublisher,
      startDate,
      endDate,
    });
  }, [selectedKeywords, selectedPublisher, startDate, endDate, onFilterChange]);

  const handleKeywordToggle = (keywordId: number) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((id) => id !== keywordId)
        : [...prev, keywordId]
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Filter Acts</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <div key={keyword.id} className="flex items-center space-x-2">
              <Checkbox
                id={`keyword-${keyword.id}`}
                checked={selectedKeywords.includes(keyword.id)}
                onCheckedChange={() => handleKeywordToggle(keyword.id)}
              />
              <label
                htmlFor={`keyword-${keyword.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {keyword.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Publisher</h3>
        <Select onValueChange={(value) => setSelectedPublisher(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a publisher" />
          </SelectTrigger>
          <SelectContent>
            {publishers.map((publisher) => (
              <SelectItem key={publisher.id} value={publisher.id.toString()}>
                {publisher.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Date Range</h3>
        <div className="flex space-x-4">
          {/* <Calendar
            onSelect={(date) => setStartDate(date)}
            selected={startDate}
          />
          <Calendar onSelect={(date) => setEndDate(date)} selected={endDate} /> */}
        </div>
      </div>

      <Button
        onClick={() =>
          onFilterChange({
            keywords: selectedKeywords,
            publisher: selectedPublisher,
            startDate,
            endDate,
          })
        }
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default ActFilter;
