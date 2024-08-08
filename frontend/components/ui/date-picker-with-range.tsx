"use client"
import * as React from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, CheckIcon } from "lucide-react"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex flex-col items-center">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="rounded-md border"
        />
        <div className="mt-4 text-center">
          {date?.from ? (
            date.to ? (
              <div className="flex items-center justify-center space-x-2">
                <CheckIcon className="text-green-500" />
                <p className="text-lg font-semibold">
                  {format(date.from, "dd.MM.yyyy")} - {format(date.to, "dd.MM.yyyy")}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CalendarIcon className="text-blue-500" />
                <p className="text-lg font-semibold">
                  Start: {format(date.from, "dd.MM.yyyy")}
                </p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <CalendarIcon className="text-gray-500" />
              <p className="text-lg font-semibold">Wybierz zakres dat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}