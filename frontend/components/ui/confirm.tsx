"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  url: string;
  selectedCategories?: string[];
  selectedKinds?: string[];
  selectedStart_date?: string;
  selectedEnd_date?: string;
  [key: string]: string[] | string | undefined;
};

function ConfirmButton({ url, ...props }: ConfirmButtonProps) {
  const router = useRouter();

  const handleConfirm = () => {
    const params = new URLSearchParams();

    Object.entries(props).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length) {
        const paramKey = key.replace("selected", "").toLowerCase();
        params.append(paramKey, value.map((item) => item.split(" (")[0]).join(","));
      } else if (typeof value === 'string' && value) {
        const paramKey = key.replace("selected", "").toLowerCase();
        params.append(paramKey, value);
      }
    });

    router.push(`/${url}?${params.toString()}`);
  };

  return <Button onClick={handleConfirm}>Wyszukaj</Button>;
}

export default ConfirmButton;