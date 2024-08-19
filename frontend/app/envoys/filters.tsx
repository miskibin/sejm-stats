import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, GraduationCap, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterComponentProps {
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  educationFilter: string;
  onEducationChange: (value: string) => void;
  clubFilter: string;
  onClubChange: (value: string) => void;
  educationLevels: FilterOption[];
  clubs: FilterOption[];
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  search,
  onSearchChange,
  educationFilter,
  onEducationChange,
  clubFilter,
  onClubChange,
  educationLevels,
  clubs
}) => {
  const renderFilter = (
    title: string,
    options: FilterOption[],
    selectedValue: string,
    onValueChange: (value: string) => void,
    icon: React.ReactNode
  ) => {
    const selectedOption = options.find(option => option.value === selectedValue);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            {icon}
            <span className="ml-2">{title}</span>
            {selectedValue !== 'all' && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selectedOption?.label}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Szukaj ${title.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Nie znaleziono wyników</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onValueChange(option.value)}
                  >
                    <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                      selectedValue === option.value ? "bg-primary text-primary-foreground" : "opacity-50"
                    }`}>
                      {selectedValue === option.value && <span>✓</span>}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex flex-col space-y-4 mb-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Wyszukaj posła..."
          value={search}
          onChange={onSearchChange}
          className="pl-10 max-w-96"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      {renderFilter("Wykształcenie", educationLevels, educationFilter, onEducationChange, <GraduationCap className="h-4 w-4" />)}
      {renderFilter("Klub", clubs, clubFilter, onClubChange, <Users className="h-4 w-4" />)}
    </div>
  );
};

export default FilterComponent;