import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AgeDistributionData {
  club_stats: { [key: string]: { envoy_count: number } };
  age_distribution: { [key: string]: { [age: string]: number } };
}

interface AgeDistributionChartProps {
  data: AgeDistributionData;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({
  data,
}) => {
  const clubsAndData = useMemo(() => {
    const clubs = Object.keys(data.club_stats).filter(
      (club) => club !== "total" && data.club_stats[club].envoy_count >= 8
    );

    const ageRanges = Array.from({ length: 11 }, (_, i) => i * 5 + 25);
    const chartData = ageRanges.map((startAge) => {
      const endAge = startAge + 4;
      const rangeLabel = `${startAge}-${endAge}`;

      return {
        ageRange: rangeLabel,
        ...clubs.reduce((acc, club) => {
          const count = Object.entries(data.age_distribution[club])
            .filter(([age, _]) => {
              const ageNum = parseInt(age);
              return ageNum >= startAge && ageNum <= endAge;
            })
            .reduce((sum, [_, count]) => sum + count, 0);
          return { ...acc, [club]: count };
        }, {}),
      };
    });

    return { clubs, chartData };
  }, [data]);

  const [visibleClubs, setVisibleClubs] = useState<string[]>([]);

  useEffect(() => {
    setVisibleClubs(clubsAndData.clubs);
  }, [clubsAndData.clubs]);

  const toggleClub = (club: string) => {
    setVisibleClubs((prev) =>
      prev.includes(club) ? prev.filter((c) => c !== club) : [...prev, club]
    );
  };

  return (
    <Card className="w-full h-auto">
      <CardHeader>
        <CardTitle>Rozkład wieku w klubach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={clubsAndData.chartData}>
              <XAxis dataKey="ageRange" />
              <YAxis />
              <Tooltip />
              {clubsAndData.clubs.map((club, index) => (
                visibleClubs.includes(club) && (
                  <Line
                    key={club}
                    type="monotone"
                    dataKey={club}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={3}
                    dot={false}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-full flex-wrap gap-4 items-center">
          {clubsAndData.clubs.map((club, index) => (
            <button
              key={club}
              onClick={() => toggleClub(club)}
              className={`text-sm font-medium leading-none cursor-pointer select-none ${
                visibleClubs.includes(club) ? "" : "opacity-50"
              }`}
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {club}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeDistributionChart;