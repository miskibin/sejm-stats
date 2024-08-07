import React from 'react';
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  return (
    <div className="w-full p-2 sm:p-4">
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
        {selected.length === 0 ? (
          <span className="text-gray-500 text-sm sm:text-base">Nic nie wybrano</span>
        ) : (
          selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="py-1 px-2 text-xs sm:text-sm flex items-center"
            >
              <span className="max-w-[100px] sm:max-w-[150px] truncate">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 sm:ml-2"
                onClick={() => onChange(selected.filter((i) => i !== item))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        )}
      </div>
      <Command className="border rounded-md">
        <CommandInput placeholder={placeholder} className="text-sm sm:text-base" />
        <CommandList className="max-h-[200px] sm:max-h-[300px] overflow-y-auto">
          <CommandEmpty className="text-sm sm:text-base">Nie znaleziono wyników.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    onChange(
                      isSelected
                        ? selected.filter((item) => item !== option)
                        : [...selected, option]
                    );
                  }}
                  className="text-sm sm:text-base"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  <span className="truncate">{option}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
      {selected.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 text-xs sm:text-sm"
          onClick={() => onChange([])}
        >
          Wyczyść wszystko
        </Button>
      )}
    </div>
  );
}