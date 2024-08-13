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
  MessageSquare,
  Vote,
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
import Image from "next/image";
import { DistrictMap } from "./mapping";
import useChartDefaults from "@/utils/chartDefaults";
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

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const { data: club, isLoading, error } = useFetchData<any>(`/clubs/${id}/`);
  const chartDefaults = useChartDefaults();

  if (isLoading) return <SkeletonComponent />;
  if (error) return <div>Error: {error.message}</div>;
  if (!club) return null;

  const ageDistributionData = {
    labels: Object.keys(club.age_distribution),
    datasets: [
      {
        label: "Liczba posłów",
        data: Object.values(club.age_distribution),
        backgroundColor: chartDefaults.colors.background,
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
        backgroundColor: chartDefaults.colors.background,
      },
    ],
  };

  const educationDistributionData = {
    labels: club.education_distribution.map((item: any) => item.educationLevel),
    datasets: [
      {
        data: club.education_distribution.map((item: any) => item.count),
        backgroundColor: chartDefaults.colors.background,
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
        borderColor: chartDefaults.colors.border[0],
        backgroundColor: `${chartDefaults.colors.border[0]}`,
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
        backgroundColor: chartDefaults.colors.border.slice(0, 3),
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
      <Card className="w-full overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg  ">
        <CardHeader className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {club.id && (
              <div className="border-4 border-white  rounded-md bg-white p-1">
                <Image
                  src={`/media/club_logos/${club.id}.jpg`}
                  alt={club.id}
                  width={48}
                  height={48}
                  onError={(e) => {
                    e.currentTarget.src = "/no-picture.jpg";
                  }}
                />
              </div>
            )}
            <div>
              <CardTitle className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
                {club.id}
              </CardTitle>
              <h2 className="text-xl font-semibold leading-tight text-gray-700 dark:text-gray-300">
                {club.name}
              </h2>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Członkowie: {club.membersCount}</span>
          </Badge>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-t-3xl shadow-inner bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <a href={`mailto:${club.email}`} className="hover:underline">
                {club.email}
              </a>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Phone className="w-5 h-5 text-green-500 dark:text-green-400" />
              <a
                href={`tel:${club.phone || club.fax}`}
                className="hover:underline"
              >
                {club.phone || club.fax}
              </a>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span>Dodatkowe informacje</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg flex flex-col items-center justify-center">
                <MessageSquare className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mb-1" />
                <p className="font-medium">Interpelacje</p>
                <p className="text-lg font-bold">{club.interpellation_count}</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex flex-col items-center justify-center">
                <FileText className="w-6 h-6 text-red-500 dark:text-red-400 mb-1" />
                <p className="font-medium">Procesy</p>
                <p className="text-lg font-bold">{club.process_count}</p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Vote className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <span className="font-medium">Głosy wyborcze:</span>
              </div>
              <span className="text-lg font-bold">
                {formatNumber(club.total_votes_number)}
              </span>
            </div>
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
            {/* @ts-ignore */}
            <Bar data={ageDistributionData} options={chartDefaults} />
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
            {/* @ts-ignore */}
            <Pie data={sexDistributionData} options={chartDefaults} />
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
            {/* @ts-ignore */}
            <Bar data={educationDistributionData} options={chartDefaults} />
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
            {/* @ts-ignore */}
            <Line data={interpellationsData} options={chartDefaults} />
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
            {/* @ts-ignore */}
            <Bar data={votingStatsData} options={chartDefaults} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubDetail;
