import React, { useState, useMemo } from "react";
import {
  format,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { pl } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MonthRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

const polishMonths = [
  "Sty",
  "Lut",
  "Mar",
  "Kwi",
  "Maj",
  "Cze",
  "Lip",
  "Sie",
  "Wrz",
  "Paź",
  "Lis",
  "Gru",
];

const startDate = new Date(2023, 9, 1); // October 2023
const endDate = new Date(); // Today's date

export function MonthRangePicker({
  date,
  setDate,
  className,
  onNext,
  onPrevious,
}: MonthRangePickerProps) {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const handleMonthClick = (monthIndex: number) => {
    const clickedDate = new Date(viewYear, monthIndex);
    if (!isWithinInterval(clickedDate, { start: startDate, end: endDate }))
      return;

    if (!date?.from) {
      setDate({ from: startOfMonth(clickedDate), to: undefined });
    } else if (date.from && !date.to && isAfter(clickedDate, date.from)) {
      setDate({ from: date.from, to: endOfMonth(clickedDate) });
    } else {
      setDate({ from: startOfMonth(clickedDate), to: undefined });
    }
  };

  const isSelected = (monthIndex: number) => {
    const monthDate = new Date(viewYear, monthIndex);
    if (!date?.from) return false;
    if (!date.to) return isSameMonth(monthDate, date.from);
    return isWithinInterval(monthDate, { start: date.from, end: date.to });
  };

  const isDisabled = (monthIndex: number) => {
    const monthDate = new Date(viewYear, monthIndex);
    return !isWithinInterval(monthDate, { start: startDate, end: endDate });
  };

  const canGoBack = viewYear > startDate.getFullYear();
  const canGoForward = viewYear < endDate.getFullYear();

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewYear((year) => year - 1)}
            disabled={!canGoBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{viewYear}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewYear((year) => year + 1)}
            disabled={!canGoForward}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {polishMonths.map((month, index) => (
            <Button
              key={month}
              variant={isSelected(index) ? "default" : "ghost"}
              className={cn(
                "h-10 text-sm",
                isSelected(index) && " ",
                isDisabled(index) && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleMonthClick(index)}
              disabled={isDisabled(index)}
            >
              {month}
            </Button>
          ))}
        </div>
      </div>
      <div className="border-t p-4 flex items-center justify-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-2" />
          <span>
            {format(date?.from || new Date(), "LLL yyyy", { locale: pl })}
            {date?.to && ` - ${format(date.to, "LLL yyyy", { locale: pl })}`}
          </span>
      </div>
    </>
  );
}

export default MonthRangePicker;
