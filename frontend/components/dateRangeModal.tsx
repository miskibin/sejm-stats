import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (range: string, options: Record<string, boolean>) => void;
}

type SearchOptionKey =
  | "committee_sittings"
  | "interpellations"
  | "processes"
  | "prints"
  | "acts"
  | "votings";

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const ranges = [
    { label: "miesiąc", value: "1m" },
    { label: "3 miesiące", value: "3m" },
    { label: "6 miesięcy", value: "6m" },
    { label: "1 rok", value: "12m" },
    { label: "Wszystko", value: "all" },
  ];

  const [searchOptions, setSearchOptions] = useState<
    Record<SearchOptionKey, boolean>
  >({
    committee_sittings: true,
    interpellations: true,
    processes: true,
    prints: true,
    acts: false,
    votings: true,
  });

  const handleOptionChange = (option: SearchOptionKey) => {
    setSearchOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSelect = (range: string) => {
    onSelect(range, searchOptions);
  };

  const getOptionLabel = (key: SearchOptionKey): string => {
    switch (key) {
      case "committee_sittings":
        return "Posiedzenia komisji";
      case "interpellations":
        return "Interpelacje";
      case "processes":
        return "Procesy";
      case "prints":
        return "Druki";
      case "acts":
        return "Akty prawne";
      case "votings":
        return "Głosowania";
      default:
        return key;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Wybierz zakres dat i opcje wyszukiwania
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(searchOptions) as SearchOptionKey[]).map((key) => (
              <div key={key} className="flex items-center space-x-3">
                <Checkbox
                  id={key}
                  checked={searchOptions[key]}
                  onCheckedChange={() => handleOptionChange(key)}
                  className="w-5 h-5"
                />
                <Label htmlFor={key} className="text-base cursor-pointer">
                  {getOptionLabel(key)}
                </Label>
              </div>
            ))}
          </div>
          <hr />
          <div className="flex flex-wrap justify-between gap-2">
            {ranges.map((range, index) => (
              <Button
                key={range.value}
                onClick={() => handleSelect(range.value)}
                variant="outline"
                className={`flex-1 min-w-[calc(20%-8px)] ${
                  index === 0
                    ? "rounded-l-md"
                    : index === ranges.length - 1
                    ? "rounded-r-md"
                    : "rounded-none"
                }`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangeModal;
