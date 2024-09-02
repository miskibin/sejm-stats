"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import LoadableContainer from "@/components/loadableContainer";
import EnvoyCard from "./envoyCard";
import { Envoy } from "@/lib/types";
import Spinner from "@/components/ui/spinner";
import { FilterComponent } from "./filters";

const PAGE_SIZE = 20;

export default function EnvoysPage() {
  const [allEnvoys, setAllEnvoys] = useState<Envoy[]>([]);
  const [displayedEnvoys, setDisplayedEnvoys] = useState<Envoy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [educationFilter, setEducationFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all");
  const [page, setPage] = useState(1);

  const observer = useRef<IntersectionObserver>();
  const lastEnvoyElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  const fetchAllEnvoys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/envoys/?page_size=1000`
      );
      const data = await response.json();
      setAllEnvoys(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEnvoys();
  }, []);

  const filteredEnvoys = useMemo(() => {
    return allEnvoys.filter((envoy) => {
      const matchesSearch = `${envoy.firstName} ${envoy.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesEducation =
        educationFilter === "all" || envoy.educationLevel === educationFilter;
      const matchesClub = clubFilter === "all" || envoy.club === clubFilter;

      return matchesSearch && matchesEducation && matchesClub;
    });
  }, [allEnvoys, search, educationFilter, clubFilter]);

  useEffect(() => {
    setDisplayedEnvoys(filteredEnvoys.slice(0, page * PAGE_SIZE));
  }, [filteredEnvoys, page]);

  const educationLevels = useMemo(() => {
    return [
      { value: "all", label: "Wszystkie" },
      ...Array.from(
        new Set(allEnvoys.map((envoy) => envoy.educationLevel))
      ).map((level) => ({ value: level, label: level })),
    ];
  }, [allEnvoys]);

  const clubs = useMemo(() => {
    return [
      { value: "all", label: "Wszystkie" },
      ...Array.from(
        new Set(allEnvoys.map((envoy) => envoy.club || "Unknown"))
      ).map((club) => ({ value: club, label: club })),
    ];
  }, [allEnvoys]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleEducationFilter = (value: string) => {
    setEducationFilter(value);
    setPage(1);
  };

  const handleClubFilter = (value: string) => {
    setClubFilter(value);
    setPage(1);
  };

  return (
    <LoadableContainer>
      <div className="container mx-auto px-4 py-8">
        <FilterComponent
          search={search}
          onSearchChange={handleSearch}
          educationFilter={educationFilter}
          onEducationChange={handleEducationFilter}
          clubFilter={clubFilter}
          onClubChange={handleClubFilter}
          educationLevels={educationLevels}
          clubs={clubs}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedEnvoys.map((envoy, index) => (
            <div
              key={`${envoy.firstName}-${envoy.lastName}-${envoy.photo}`}
              ref={
                index === displayedEnvoys.length - 1
                  ? lastEnvoyElementRef
                  : null
              }
            >
              <EnvoyCard
                firstName={envoy.firstName}
                lastName={envoy.lastName}
                educationLevel={envoy.educationLevel}
                numberOfVotes={envoy.numberOfVotes}
                photo={envoy.photo}
                clubPhoto={envoy.club_photo}
                id={envoy.id}
              />
            </div>
          ))}
        </div>
        {isLoading && (
          <p className="text-center mt-4">
            <Spinner variant="primary" />
          </p>
        )}
      </div>
    </LoadableContainer>
  );
}
