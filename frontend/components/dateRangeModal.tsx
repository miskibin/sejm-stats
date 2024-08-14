import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (range: string) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({ isOpen, onClose, onSelect }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wybierz zakres dat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => onSelect('1m')}>Ostatni miesiąc</Button>
          <Button onClick={() => onSelect('3m')}>Ostatnie 3 miesiące</Button>
          <Button onClick={() => onSelect('all')}>Wszystkie dane</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangeModal;