/**
 * A generic ConfirmButton component that can handle any number of selected fields.
 * It constructs a URL query string based on the provided selected items and navigates to the results page.
 *
 * @param props - An object containing key-value pairs where:
 *   - key: string representing the field name
 *   - value: string[] representing the selected items for that field
 *
 * Usage example:
 * <ConfirmButton
 *   selectedPublishers={selectedPublishers}
 *   selectedInstitutions={selectedInstitutions}
 * />
 */

"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  [key: string]: string[];
};

export default function ConfirmButton(props: ConfirmButtonProps) {
  const router = useRouter();

  const handleConfirm = () => {
    const params = new URLSearchParams();

    Object.entries(props).forEach(([key, value]) => {
      // selectedParam -> param
      key = key.replace("selected", "").toLowerCase();
      if (value.length) {
        params.append(key, value.map((item) => item.split(" (")[0]).join(","));
      }
    });

    router.push(`/acts-results?${params.toString()}`);
  };

  return <Button onClick={handleConfirm}>Wyszukaj akty</Button>;
}
