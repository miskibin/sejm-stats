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
    <div className="w-full  p-4">
      {/* <h3 className="text-lg font-semibold mb-2">{placeholder}</h3> */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selected.length === 0 ? (
          <span className="text-gray-500">Nic nie wybrano</span>
        ) : (
          selected.map((item) => (
            <Badge
              key={item}
              variant="secondary"
              className="py-1 px-2 text-xs flex items-center"
            >
              {item}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2"
                onClick={() => onChange(selected.filter((i) => i !== item))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        )}
      </div>
      <Command className="border rounded-md">
        <CommandInput placeholder="Szukaj..." />
        <CommandList>
          <CommandEmpty>Nie znaleziono wyników.</CommandEmpty>
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
                  <span>{option}</span>
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
          className="mt-2"
          onClick={() => onChange([])}
        >
          Wyczyść wszystko
        </Button>
      )}
    </div>
  );
}