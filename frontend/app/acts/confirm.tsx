"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ConfirmButtonProps {
  selectedPublishers: string[];
  selectedKeywords: string[];
  selectedStatuses: string[];
  selectedInstitutions: string[];
}

export default function ConfirmButton({
  selectedPublishers,
  selectedKeywords,
  selectedStatuses,
  selectedInstitutions,
}: ConfirmButtonProps) {
  const router = useRouter();

  const handleConfirm = () => {
    const params = new URLSearchParams();
    
    if (selectedPublishers.length) params.append('publishers', selectedPublishers.map(p => p.split(' (')[0]).join(','));
    if (selectedKeywords.length) params.append('keywords', selectedKeywords.map(k => k.split(' (')[0]).join(','));
    if (selectedStatuses.length) params.append('statuses', selectedStatuses.map(s => s.split(' (')[0]).join(','));
    if (selectedInstitutions.length) params.append('institutions', selectedInstitutions.map(i => i.split(' (')[0]).join(','));

    router.push(`/acts-results?${params.toString()}`);
  };

  return (
    <Button onClick={handleConfirm}>
      Wyszukaj akty
    </Button>
  );
}