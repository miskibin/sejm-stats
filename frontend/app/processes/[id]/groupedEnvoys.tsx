import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const AdaptiveGroupedMPs = ({ mps }) => {
  if (!mps || mps.length === 0) {
    return null; // Don't render anything if there are no MPs
  }

  // Group MPs by club
  const groupedMPs = mps.reduce((acc, mp) => {
    if (!acc[mp.club]) {
      acc[mp.club] = [];
    }
    acc[mp.club].push(mp);
    return acc;
  }, {});

  const clubCount = Object.keys(groupedMPs).length;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Posłowie
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clubCount === 1 ? (
          // Single club layout
          <div>
            <h3 className="font-bold text-lg mb-2">{Object.keys(groupedMPs)[0]}</h3>
            <ul className="columns-2 sm:columns-3 md:columns-4 gap-4">
              {Object.values(groupedMPs)[0].map((mp) => (
                <li key={mp.id} className="break-inside-avoid">
                  <Link href={`/envoys/${mp.id}`} className="text-blue-600 hover:underline">
                    {mp.firstName} {mp.lastName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // Multiple clubs layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedMPs).map(([club, clubMPs]) => (
              <div key={club} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{club}</h3>
                <ul className="space-y-1">
                  {clubMPs.map((mp) => (
                    <li key={mp.id}>
                      <Link href={`/envoys/${mp.id}`} className="text-blue-600 hover:underline">
                        {mp.firstName} {mp.lastName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveGroupedMPs;