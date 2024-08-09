"use client";
import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  PieChart,
  Users,
  Mail,
  Phone,
  FileText,
  LineChart,
  MapPin,
} from "lucide-react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { DataTable } from "@/components/dataTable/dataTable";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import { DistrictData, districtToRegionMapping } from "./mapping";

// Initialize Highcharts modules
if (typeof window !== "undefined") {
  highchartsMap(Highcharts);
  window.proj4 = proj4;
}

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function mapDistrictDataToHighcharts(
  districtData: DistrictData[]
): [string, number][] {
  const mappedData: Record<string, number> = {};

  districtData.forEach((district) => {
    const regionCode = districtToRegionMapping[district.districtName];
    if (regionCode) {
      mappedData[regionCode] = (mappedData[regionCode] || 0) + district.count;
    }
  });

  return Object.entries(mappedData);
}

const DistrictMap: React.FC<{ districtData: DistrictData[] }> = ({
  districtData,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const response = await fetch(
          "https://code.highcharts.com/mapdata/countries/pl/pl-all.topo.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const topology = await response.json();

        if (chartRef.current && chartRef.current.chart) {
          chartRef.current.chart.update({
            chart: {
              backgroundColor: undefined, 
              map: topology,
            },
            series: [
              {
                type: "map",
                data: mapDistrictDataToHighcharts(districtData),
                mapData: topology,
                name: "Ilość posłów z okręgu",
                states: {
                  hover: {
                    color: "#BADA55",
                  },
                },
                dataLabels: {
                  enabled: false,
                  format: "{point.name}",
                },
              },
            ],
          });
        }
      } catch (error) {
        console.error("Failed to fetch topology:", error);
      }
    };

    fetchTopology();
  }, [districtData]);

  const options: Highcharts.Options = {
    chart: {
      map: undefined,
    },
    title: {
      text: undefined,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: 0,
    },
    series: [
      {
        type: "map",
        name: "Number of MPs",
        states: {
          hover: {
            color: "#BADA55",
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
        allAreas: true,
        data: [],
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"mapChart"}
      ref={chartRef}
    />
  );
};

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const { data: club, isLoading, error } = useFetchData<any>(`/clubs/${id}/`);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <div>Error: {error.message}</div>;
  if (!club) return null;

  const chartColors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const ageDistributionData = {
    labels: Object.keys(club.age_distribution),
    datasets: [
      {
        label: "Liczba posłów",
        data: Object.values(club.age_distribution),
        backgroundColor: chartColors,
      },
    ],
  };

  const sexDistributionData = {
    labels: ["Mężczyźni", "Kobiety"],
    datasets: [
      {
        data: [
          club.sex_distribution.find((item: any) => !item.isFemale)?.count || 0,
          club.sex_distribution.find((item: any) => item.isFemale)?.count || 0,
        ],
        backgroundColor: chartColors,
      },
    ],
  };

  const educationDistributionData = {
    labels: club.education_distribution.map((item: any) => item.educationLevel),
    datasets: [
      {
        data: club.education_distribution.map((item: any) => item.count),
        backgroundColor: chartColors,
      },
    ],
  };

  const interpellationsData = {
    labels: club.interpellations_per_month.map(
      (item: any) => `${item.receiptDate__year}-${item.receiptDate__month}`
    ),
    datasets: [
      {
        label: "Interpelacje",
        data: club.interpellations_per_month.map((item: any) => item.count),
        borderColor: chartColors[0],
        backgroundColor: `${chartColors[0]}33`,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const votingStatsData = {
    labels: ["Za", "Przeciw", "Wstrzymało się"],
    datasets: [
      {
        label: "Liczba głosów",
        data: [
          club.voting_stats.yes,
          club.voting_stats.no,
          club.voting_stats.abstain,
        ],
        backgroundColor: chartColors.slice(0, 3),
      },
    ],
  };

  const districtColumns = [
    { accessorKey: "districtName", header: "Okręg" },
    { accessorKey: "count", header: "Liczba posłów" },
  ];

  const formatNumber = (num: number) => {
    return (num / 1000).toFixed(1) + "k";
  };

  return (
    <div className="container mx-auto p-4 md:p-8 sm:p-0 sm:px-0 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{club.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <div>
            <p>
              <Mail className="inline mr-2" />
              {club.email}
            </p>
            <p>
              <Phone className="inline mr-2" />
              {club.phone || club.fax}
            </p>
            <Badge>Liczba członków: {club.membersCount}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-6 h-6 mr-2" />
              Rozkład wieku
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              data={ageDistributionData}
              options={{
                ...commonOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-6 h-6 mr-2" />
              Rozkład płci
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Pie data={sexDistributionData} options={commonOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-6 h-6 mr-2" />
              Wykształcenie
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Pie data={educationDistributionData} options={commonOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="w-6 h-6 mr-2" />
              Interpelacje miesięcznie
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Line
              data={interpellationsData}
              options={{
                ...commonOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Rozkład okręgów
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <DistrictMap districtData={club.district_distribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="w-6 h-6 mr-2" />
              Statystyki głosowań
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <Bar
              data={votingStatsData}
              options={{
                ...commonOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Dodatkowe informacje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Liczba interpelacji: {club.interpellation_count}</p>
          <p>Liczba procesów: {club.process_count}</p>
          <p>
            Całkowita liczba głosów wyborczych:{" "}
            {formatNumber(club.total_votes_number)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;
