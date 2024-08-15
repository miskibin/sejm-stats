"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart, MapPin } from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart as RechartsPieChart,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import { DistrictMap } from "./mapping";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import Highcharts from "highcharts";
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import { renderClubCard } from "./renderClubCard";

if (typeof window !== "undefined") {
  highchartsMap(Highcharts);
  window.proj4 = proj4;
}

const chartColors: string[] = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon, children }) => (
  <Card className="py-2">
    <CardHeader>
      <CardTitle className="flex items-center">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pb-3">{children}</CardContent>
  </Card>
);

interface ChartData {
  [key: string]: string | number;
}

const renderChart = (
  ChartComponent: typeof RechartsBarChart | typeof RechartsLineChart,
  data: ChartData[],
  dataKey: string,
  nameKey: string | null = null
) => (
  <ResponsiveContainer width="100%" height="100%">
    <ChartComponent
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={nameKey || dataKey} />
      <YAxis />
      <ChartTooltip content={<ChartTooltipContent />} />
      {ChartComponent === RechartsBarChart ? (
        <Bar dataKey={dataKey}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Bar>
      ) : (
        <Line type="monotone" dataKey={dataKey} stroke={chartColors[0]} />
      )}
    </ChartComponent>
  </ResponsiveContainer>
);

interface ClubData {
  age_distribution: { [key: string]: number };
  sex_distribution: { isFemale: boolean; count: number }[];
  education_distribution: { educationLevel: string; count: number }[];
  interpellations_per_month: {
    receiptDate__year: number;
    receiptDate__month: number;
    count: number;
  }[];
  voting_stats: { yes: number; no: number; abstain: number };
  district_distribution: any; // You may want to define a more specific type for this
}

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const {
    data: club,
    isLoading,
    error,
  } = useFetchData<ClubData>(`/clubs/${id}/`);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <div>Error: {error.message}</div>;
  if (!club) return null;

  const ageDistributionData = Object.entries(club.age_distribution || {}).map(
    ([range, count]) => ({ range, count })
  );
  const sexDistributionData = [
    {
      gender: "Mężczyźni",
      value: club.sex_distribution?.find((item) => !item.isFemale)?.count || 0,
    },
    {
      gender: "Kobiety",
      value: club.sex_distribution?.find((item) => item.isFemale)?.count || 0,
    },
  ];
  const educationDistributionData =
    club.education_distribution?.map((item) => ({
      level: item.educationLevel,
      count: item.count,
    })) || [];
  const interpellationsData =
    club.interpellations_per_month?.map((item) => ({
      date: `${item.receiptDate__year}-${item.receiptDate__month}`,
      count: item.count,
    })) || [];
  const votingStatsData = [
    { type: "Za", count: club.voting_stats?.yes || 0 },
    { type: "Przeciw", count: club.voting_stats?.no || 0 },
    { type: "Wstrzymało się", count: club.voting_stats?.abstain || 0 },
  ];

  const chartConfigs: { [key: string]: ChartConfig } = {
    age: { count: { label: "Liczba posłów", color: chartColors[0] } },
    sex: { value: { label: "Liczba posłów" } },
    education: { count: { label: "Liczba posłów", color: chartColors[0] } },
    interpellations: {
      count: { label: "Liczba interpelacji", color: chartColors[0] },
    },
    voting: {
      Za: { label: "Za", color: chartColors[0] },
      Przeciw: { label: "Przeciw", color: chartColors[1] },
      "Wstrzymało się": { label: "Wstrzymało się", color: chartColors[2] },
    },
  };

  return (
    <div className="container mx-auto p-4 md:p-8 sm:p-0 sm:px-0 space-y-8">
      {renderClubCard(club, (num: number) => (num / 1000).toFixed(1) + "k")}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard
          title="Rozkład wieku"
          icon={<BarChart className="w-6 h-6 mr-2" />}
        >
          <ChartContainer config={chartConfigs.age}>
            {renderChart(
              RechartsBarChart,
              ageDistributionData,
              "count",
              "range"
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Rozkład płci"
          icon={<PieChart className="w-6 h-6 mr-2" />}
        >
          <ChartContainer config={chartConfigs.sex}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart
              >
                <Pie
                  data={sexDistributionData}
                  dataKey="value"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  label
                >
                  {sexDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index+ 1 % chartColors.length ]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Wykształcenie"
          icon={<BarChart className="w-6 h-6 mr-2" />}
        >
          <ChartContainer config={chartConfigs.education}>
            {renderChart(
              RechartsBarChart,
              educationDistributionData,
              "count",
              "level"
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Interpelacje miesięcznie"
          icon={<LineChart className="w-6 h-6 mr-2" />}
        >
          <ChartContainer config={chartConfigs.interpellations}>
            {renderChart(
              RechartsLineChart,
              interpellationsData,
              "count",
              "date"
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard
          title="Rozkład okręgów"
          icon={<MapPin className="w-6 h-6 mr-2" />}
        >
          <DistrictMap districtData={club.district_distribution} />
        </ChartCard>

        <ChartCard
          title="Statystyki głosowań"
          icon={<BarChart className="w-6 h-6 mr-2" />}
        >
          <ChartContainer config={chartConfigs.voting} className="py-4">
            {renderChart(RechartsBarChart, votingStatsData, "count", "type")}
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default ClubDetail;
