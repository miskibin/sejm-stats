"use client"
import React, { useState, useMemo, useEffect } from "react";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import { ReusableChart } from "@/components/chart-container";

interface TotalStatsData {
  club_stats: { [key: string]: { envoy_count: number } };
  age_distribution: { [key: string]: { [age: string]: number } };
  sex_distribution: { [key: string]: { Male: number; Female: number } };
  interpellations_stats: {
    [key: string]: { total: number; with_reply: number; with_no_reply: number };
  };
  committee_stats: {
    [key: string]: {
      membership_count: number;
      functions: { [key: string]: number };
    };
  };
  top_committees: { name: string; sitting_count: number }[];
  top_interpellation_recipients: { recipient: string[]; count: number }[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const TotalStatsDashboard: React.FC = () => {
  const { data, isLoading, error } = useFetchData<TotalStatsData>("/total-stats");
  const [visibleAgeClubs, setVisibleAgeClubs] = useState<string[]>([]);
  const [visibleSexKeys, setVisibleSexKeys] = useState<string[]>(["Male", "Female"]);
  const [visibleInterpellationKeys, setVisibleInterpellationKeys] = useState<string[]>(["with_reply", "with_no_reply"]);
  const [visibleCommitteeKeys, setVisibleCommitteeKeys] = useState<string[]>([]);

  const {
    ageData,
    sexData,
    interpellationsData,
    committeeMembershipData,
    topCommitteesData,
    topRecipientsData,
    clubs,
  } = useMemo(() => {
    if (!data) return {
      ageData: [], sexData: [], interpellationsData: [], committeeMembershipData: [],
      topCommitteesData: [], topRecipientsData: [], clubs: []
    };

    const clubs = Object.keys(data.club_stats).filter(
      (club) => club !== "total" && data.club_stats[club].envoy_count >= 8
    );
    const ageRanges = Array.from({ length: 11 }, (_, i) => i * 5 + 25);
    const ageData = ageRanges.map((startAge) => {
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

    const sexData = clubs.map((club) => ({
      name: club,
      Male: data.sex_distribution[club].Male,
      Female: data.sex_distribution[club].Female,
    }));
    const interpellationsData = clubs.map((club) => ({
        name: club,
        with_reply: data.interpellations_stats[club].with_reply,
        with_no_reply: data.interpellations_stats[club].with_no_reply,
      })).sort((a, b) => (b.with_reply + b.with_no_reply) - (a.with_reply + a.with_no_reply));
  
      const committeeMembershipData = clubs.map((club) => ({
        name: club,
        członek: data.committee_stats[club].functions["null"] || 0,
        "zastępca przewodniczącego": 
          (data.committee_stats[club].functions["zastępca przewodniczącego"] || 0) +
          (data.committee_stats[club].functions["zastępczyni przewodniczącej"] || 0) +
          (data.committee_stats[club].functions["zastępca przewodniczącej"] || 0),
        przewodniczący: 
          (data.committee_stats[club].functions["przewodniczący"] || 0) +
          (data.committee_stats[club].functions["przewodnicząca"] || 0),
      })).sort((a, b) => 
        (b.członek + b["zastępca przewodniczącego"] + b.przewodniczący) - 
        (a.członek + a["zastępca przewodniczącego"] + a.przewodniczący)
      );
  
      const topCommitteesData = data.top_committees.slice(0, 10);
      const topRecipientsData = data.top_interpellation_recipients.slice(0, 10);
  
      return {
        ageData, sexData, interpellationsData, committeeMembershipData,
        topCommitteesData, topRecipientsData, clubs
      };
    }, [data]);
  
    useEffect(() => {
      if (clubs.length > 0) {
        setVisibleAgeClubs(clubs);
        setVisibleCommitteeKeys(["członek", "zastępca przewodniczącego", "przewodniczący"]);
      }
    }, [clubs]);
  
    const toggleKey = (setFunction: React.Dispatch<React.SetStateAction<string[]>>) => (key: string) => {
      setFunction((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    };
  
    if (isLoading) return <SkeletonComponent />;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return null;
  
    return (
      <div className="container mx-auto py-4 px-1 md:px-4 grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="w-full">
          <ReusableChart
            data={ageData}
            title="Rozkład wieku w klubach"
            type="line"
            dataKeys={clubs}
            xAxisDataKey="ageRange"
            colors={COLORS}
            visibleKeys={visibleAgeClubs}
            toggleKey={toggleKey(setVisibleAgeClubs)}
          />
        </div>
        <div className="w-full">
          <ReusableChart
            data={sexData}
            title="Rozkład płci w klubach"
            type="bar"
            dataKeys={["Male", "Female"]}
            xAxisDataKey="name"
            colors={COLORS}
            visibleKeys={visibleSexKeys}
            layout="vertical"
            stacked={true}
            toggleKey={toggleKey(setVisibleSexKeys)}
            customLabels={{ Male: "Mężczyźni", Female: "Kobiety" }}
          />
        </div>
        <div className="w-full">
          <ReusableChart
            data={interpellationsData}
            title="Statystyki interpelacji"
            type="bar"
            dataKeys={["with_reply", "with_no_reply"]}
            xAxisDataKey="name"
            colors={COLORS}
            visibleKeys={visibleInterpellationKeys}
            layout="vertical"
            stacked={true}
            toggleKey={toggleKey(setVisibleInterpellationKeys)}
            customLabels={{ with_reply: "Z odpowiedzią", with_no_reply: "Bez odpowiedzi" }}
          />
        </div>
        <div className="w-full">
          <ReusableChart
            data={committeeMembershipData}
            title="Członkostwo w komisjach"
            type="bar"
            dataKeys={["członek", "zastępca przewodniczącego", "przewodniczący"]}
            xAxisDataKey="name"
            colors={COLORS}
            visibleKeys={visibleCommitteeKeys}
            layout="vertical"
            stacked={true}
            toggleKey={toggleKey(setVisibleCommitteeKeys)}
          />
        </div>
        <div className="w-full">
          <ReusableChart
            data={topCommitteesData}
            title="Najaktywniejsze komisje"
            type="bar"
            dataKeys={["sitting_count"]}
            xAxisDataKey="name"
            colors={COLORS}
            visibleKeys={["sitting_count"]}
            layout="vertical"
            toggleKey={() => {}}
            customLabels={{ sitting_count: "Liczba posiedzeń" }}
          />
        </div>
        <div className="w-full">
          <ReusableChart
            data={topRecipientsData}
            title="Główni odbiorcy interpelacji"
            type="bar"
            dataKeys={["count"]}
            xAxisDataKey="recipient"
            colors={COLORS}
            visibleKeys={["count"]}
            layout="vertical"
            toggleKey={() => {}}
            customLabels={{ count: "Liczba interpelacji" }}
          />
        </div>
      </div>
    );
  };
  
  export default TotalStatsDashboard;