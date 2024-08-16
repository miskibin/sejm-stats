"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Briefcase,
  GraduationCap,
  Cake,
  Users,
  CheckSquare,
  ExternalLink,
  MapPin,
  Building,
  Info,
} from "lucide-react";
import { PieChart, Pie, Label, Legend } from "recharts";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import LoadableContainer from "@/components/loadableContainer";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EnvoyDetail } from "@/lib/types";

const EnvoyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>() ?? {};
  const { data, isLoading, error } = useFetchData<EnvoyDetail>(
    `/envoys/${id}/`
  );
  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;
  const envoy = data;
  if (isLoading)
    return <div className="container mx-auto p-4">Ładowanie...</div>;

  if (error) return <div className="container mx-auto p-4">{error}</div>;

  const disciplineChartData = envoy.discipline_ratio.labels.map(
    (label, index) => ({
      label,
      value: envoy.discipline_ratio.values[index],
      fill: `hsl(var(--chart-${index + 1}))`,
    })
  );
  const chartConfig: ChartConfig = {
    value: { label: "Głosy" },
    ...envoy.discipline_ratio.labels.reduce((acc, label, index) => {
      acc[label] = {
        label,
        color: `hsl(var(--chart-1))`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),
  };

  const totalVotes = disciplineChartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const activityTooltipContent =
    "Aktywność względem innych posłów. Obliczana jest na podstawie liczby głosowań, interpelacji i projektów ustaw.";
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
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
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Klub
                  </span>
                  <Link
                    href={`/clubs/${envoy.club}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {envoy.club}
                  </Link>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Okręg
                  </span>
                  <p
                    className="text-muted-foreground hover:underline"
                  >
                    {envoy.districtName} (nr {envoy.districtNum})
                  </p>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Województwo
                  </span>
                  <p
                    className="text-muted-foreground hover:underline"
                  >
                    {envoy.voivodeship}
                  </p>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Cake className="mr-2 h-4 w-4" />
                    Data i miejsce urodzenia
                  </span>
                  <span className="text-muted-foreground text-right">
                    {envoy.birthDate},<br />
                    {envoy.birthLocation}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Wykształcenie
                  </span>
                  <span className="text-muted-foreground">
                    {envoy.educationLevel}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Zawód
                  </span>
                  <span className="text-muted-foreground">
                    {envoy.profession}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Liczba głosów
                  </span>
                  <span className="text-muted-foreground">
                    {envoy.numberOfVotes.toLocaleString()}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-xl font-bold flex items-center">
                Aktywność
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{activityTooltipContent}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
              <CardDescription>Względem klubu {envoy.club}</CardDescription>
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
                  <Legend layout="horizontal"/>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-2xl font-bold">Biografia</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {envoy.biography.length > 1500
                  ? `${envoy.biography.slice(0, 1500)}...`
                  : envoy.biography}
              </p>
              <Button variant="outline" className="w-full py-0  my-2" asChild>
                <a
                  href={envoy.biography_source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Czytaj więcej <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-2xl font-bold">Członkostwo w komisjach</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {envoy.committee_memberships.map((membership, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b py-3"
                  >
                    <Link
                      href={`/committees/${membership.committee_code}`}
                      className="hover:underline"
                    >
                      {membership.committee_name}
                    </Link>
                    {membership.function && (
                      <Badge>{membership.function}</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Tabs defaultValue="votings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="votings">Głosowania</TabsTrigger>
              <TabsTrigger value="projects">Projekty</TabsTrigger>
              <TabsTrigger value="interpellations">Interpelacje</TabsTrigger>
            </TabsList>
            <TabsContent value="votings">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {envoy.latest_votings.map((voting) => (
                      <li key={voting.id} className="border-b pb-2">
                        <Link
                          href={`/votings/${voting.id}`}
                          className="hover:underline"
                        >
                          <p className="font-semibold">{voting.title}</p>
                        </Link>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {new Date(voting.date).toLocaleDateString("pl-PL")}
                          </span>
                          <Badge
                            variant={
                              voting.envoy_vote === "Za"
                                ? "success"
                                : voting.envoy_vote === "Przeciw"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {voting.envoy_vote}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" disabled>
                    Pokaż wszystkie
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {envoy.processes.map((process) => (
                      <li key={process.id} className="border-b pb-2">
                        <Link
                          href={`/processes/${process.id}`}
                          className="hover:underline"
                        >
                          <p className="font-semibold">{process.title}</p>
                        </Link>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{process.documentDate}</span>
                          <Badge>{process.length_tag}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" disabled>
                    Pokaż wszystkie
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="interpellations">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {envoy.interpellations.map((interpellation) => (
                      <li key={interpellation.id} className="border-b pb-2">
                        {interpellation.bodyLink ? (
                          <Link
                            href={interpellation.bodyLink}
                            className="hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p className="font-semibold">
                              {interpellation.title}
                            </p>
                          </Link>
                        ) : (
                          <p className="font-semibold">
                            {interpellation.title}
                          </p>
                        )}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            {new Date(
                              interpellation.lastModified
                            ).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4" disabled>
                    Pokaż wszystkie
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default EnvoyDetailPage;
