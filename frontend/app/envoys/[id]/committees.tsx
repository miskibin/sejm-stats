import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Committee {
  committee_name: string;
  committee_code: string;
  function?: string;
}

interface EnvoyCommitteesProps {
  committees: Committee[];
}

const EnvoyCommittees: React.FC<EnvoyCommitteesProps> = ({ committees }) => {
  if (committees.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-2xl font-bold">Członkostwo w komisjach</h3>
        </CardHeader>
        <CardContent>
          <p>Brak członkostwa w komisjach.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-2xl font-bold">Członkostwo w komisjach</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {committees.map((membership, index) => (
            <li key={index} className="flex justify-between items-center border-b py-3">
              <Link href={`/committees/${membership.committee_code}`} className="hover:underline">
                {membership.committee_name}
              </Link>
              {membership.function && <Badge>{membership.function}</Badge>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EnvoyCommittees;