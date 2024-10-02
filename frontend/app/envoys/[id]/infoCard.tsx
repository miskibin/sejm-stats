import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, Briefcase, GraduationCap, Cake, Users, CheckSquare, MapPin, Building, Info } from "lucide-react";
import { PieChart, Pie, Label, Legend } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { EnvoyDetail } from "@/lib/types";

interface EnvoyInfoCardProps {
  envoy: EnvoyDetail;
}

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
  <li className="flex justify-between items-center">
    <span className="flex items-center">
      {icon}
      {label}
    </span>
    {typeof value === 'string' ? (
      <span className="text-muted-foreground">{value}</span>
    ) : (
      value
    )}
  </li>
);

const ActivityTooltip: React.FC = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Info className="ml-2 h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p>Aktywność względem innych posłów. Obliczana jest na podstawie liczby głosowań, interpelacji i projektów ustaw.</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const EnvoyInfoCard: React.FC<EnvoyInfoCardProps> = React.memo(({ envoy }) => {
  const disciplineChartData = useMemo(() => 
    envoy.discipline_ratio.labels.map((label, index) => ({
      label,
      value: envoy.discipline_ratio.values[index],
      fill: `hsl(var(--chart-${index + 1}))`,
    })),
    [envoy.discipline_ratio]
  );

  const chartConfig: ChartConfig = useMemo(() => ({
    value: { label: "Głosy" },
    ...envoy.discipline_ratio.labels.reduce((acc, label) => {
      acc[label] = {
        label,
        color: `hsl(var(--chart-1))`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),
  }), [envoy.discipline_ratio.labels]);

  const totalVotes = useMemo(() => 
    disciplineChartData.reduce((sum, item) => sum + item.value, 0),
    [disciplineChartData]
  );

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src={envoy.photo}
              alt={envoy.full_name}
              width={100}
              height={100}
              className="rounded-md"
            />
            <h2 className="mt-4 text-2xl font-bold">{envoy.full_name}</h2>
            <p className="text-muted-foreground">{envoy.club}</p>
            <p className="text-muted-foreground">{envoy.districtName}</p>
            <div className="mt-4 space-x-5">
              <Button disabled>Obserwuj</Button>
              <Button variant="outline" asChild>
                <Link href={`mailto:${envoy.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardContent className="p-6">
          <ul className="space-y-4">
            <InfoItem
              icon={<Users className="mr-2 h-4 w-4" />}
              label="Klub"
              value={
                <Link
                  href={`/clubs/${envoy.club}`}
                  className="text-muted-foreground hover:underline"
                >
                  {envoy.club}
                </Link>
              }
            />
            <InfoItem
              icon={<MapPin className="mr-2 h-4 w-4" />}
              label="Okręg"
              value={`${envoy.districtName} (nr ${envoy.districtNum})`}
            />
            <InfoItem
              icon={<Building className="mr-2 h-4 w-4" />}
              label="Województwo"
              value={envoy.voivodeship}
            />
            <InfoItem
              icon={<Cake className="mr-2 h-4 w-4" />}
              label="Data i miejsce urodzenia"
              value={`${envoy.birthDate}, ${envoy.birthLocation}`}
            />
            <InfoItem
              icon={<GraduationCap className="mr-2 h-4 w-4" />}
              label="Wykształcenie"
              value={envoy.educationLevel}
            />
            <InfoItem
              icon={<Briefcase className="mr-2 h-4 w-4" />}
              label="Zawód"
              value={envoy.profession}
            />
            <InfoItem
              icon={<CheckSquare className="mr-2 h-4 w-4" />}
              label="Liczba głosów"
              value={envoy.numberOfVotes.toLocaleString()}
            />
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-xl font-bold flex items-center">
            Aktywność
            <ActivityTooltip />
          </h3>
        </CardHeader>
        <CardContent>
          <Progress value={envoy.activity_percentage} className="w-full" />
          <p className="text-center mt-2">{envoy.activity_percentage}%</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dyscyplina głosowania</CardTitle>
          <p className="text-sm text-muted-foreground">Względem klubu {envoy.club}</p>
        </CardHeader>
        <CardContent className="pb-6 px-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[260px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={disciplineChartData}
                dataKey="value"
                nameKey="label"
                innerRadius={50}
                outerRadius={110}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVotes}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Głosów
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Legend layout="horizontal" />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
});

EnvoyInfoCard.displayName = 'EnvoyInfoCard';

export default EnvoyInfoCard;