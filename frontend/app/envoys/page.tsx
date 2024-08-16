"use client"
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import LoadableContainer from "@/components/loadableContainer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EnvoyCard from "./envoyCard";
import { Envoy } from "@/lib/types";
import Spinner from "@/components/ui/spinner";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Envoy[];
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const PAGE_SIZE = 20; // Normal page size

export default function EnvoysPage() {
  const [envoys, setEnvoys] = useState<Envoy[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [educationFilter, setEducationFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const cacheRef = useRef<{
    data: Envoy[];
    timestamp: number;
    count: number;
  } | null>(null);
  const allEnvoysLoadedRef = useRef(false);

  const observer = useRef<IntersectionObserver>();
  const lastEnvoyElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !allEnvoysLoadedRef.current) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchEnvoys = async (pageNum: number, pageSize: number): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/envoys/?page=${pageNum}&page_size=${pageSize}`
      );
      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return { count: 0, next: null, previous: null, results: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnvoys = async (forceRefresh = false) => {
    if (allEnvoysLoadedRef.current && !forceRefresh) {
      return;
    }

    if (
      !forceRefresh &&
      cacheRef.current &&
      Date.now() - cacheRef.current.timestamp < CACHE_EXPIRY
    ) {
      setEnvoys(cacheRef.current.data);
      setTotalCount(cacheRef.current.count);
      setHasMore(false);
      allEnvoysLoadedRef.current = true;
      return;
    }

    const isFiltering = educationFilter !== "all" || clubFilter !== "all" || search !== "";
    const pageSize = isFiltering ? 1000 : PAGE_SIZE; // Fetch all when filtering
    const data = await fetchEnvoys(1, pageSize);

    setEnvoys(data.results);
    setTotalCount(data.count);
    setHasMore(!isFiltering && !!data.next);

    if (isFiltering || data.results.length === data.count) {
      cacheRef.current = {
        data: data.results,
        timestamp: Date.now(),
        count: data.count,
      };
      allEnvoysLoadedRef.current = true;
    }
  };

  useEffect(() => {
    loadEnvoys();
  }, []);

  useEffect(() => {
    if (page > 1 && !allEnvoysLoadedRef.current) {
      fetchEnvoys(page, PAGE_SIZE).then((data) => {
        setEnvoys((prev) => {
          const newEnvoys = [...prev, ...data.results];
          if (newEnvoys.length === data.count) {
            allEnvoysLoadedRef.current = true;
            cacheRef.current = {
              data: newEnvoys,
              timestamp: Date.now(),
              count: data.count,
            };
          }
          return newEnvoys;
        });
        setHasMore(!!data.next);
      });
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    loadEnvoys(true); // Force refresh when filters change
  }, [search, educationFilter, clubFilter]);

  const educationLevels = useMemo(() => {
    return [
      { value: "all", label: "Wszystkie" },
      ...Array.from(new Set(envoys.map((envoy) => envoy.educationLevel))).map(
        (level) => ({ value: level, label: level })
      ),
    ];
  }, [envoys]);

  const clubs = useMemo(() => {
    return [
      { value: "all", label: "Wszystkie" },
      ...Array.from(new Set(envoys.map((envoy) => envoy.club || "Unknown"))).map(
        (club) => ({ value: club, label: club })
      ),
    ];
  }, [envoys]);

  const filteredEnvoys = useMemo(() => {
    return envoys.filter((envoy) => {
      const matchesSearch = `${envoy.firstName} ${envoy.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesEducation =
        educationFilter === "all" || envoy.educationLevel === educationFilter;
      const matchesClub =
        clubFilter === "all" || envoy.club === clubFilter;

      return matchesSearch && matchesEducation && matchesClub;
    });
  }, [envoys, search, educationFilter, clubFilter]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleEducationFilter = (value: string) => {
    setEducationFilter(value);
  };

  const handleClubFilter = (value: string) => {
    setClubFilter(value);
  };

  return (
    <LoadableContainer>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Szukaj posła..."
            value={search}
            onChange={handleSearch}
            className="md:w-1/3"
          />
          <Select onValueChange={handleEducationFilter} value={educationFilter}>
            <SelectTrigger className="md:w-1/3">
              <SelectValue placeholder="Filtruj po wykształceniu" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((edu) => (
                <SelectItem key={edu.value} value={edu.value}>
                  {edu.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleClubFilter} value={clubFilter}>
            <SelectTrigger className="md:w-1/3">
              <SelectValue placeholder="Filtruj po klubie" />
            </SelectTrigger>
            <SelectContent>
              {clubs.map((club) => (
                <SelectItem key={club.value} value={club.value}>
                  {club.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <Badge variant="secondary">
              Wyszukiwanie: {search}
            </Badge>
          )}
          {educationFilter !== "all" && (
            <Badge variant="secondary">
              Wykształcenie: {educationFilter}
            </Badge>
          )}
          {clubFilter !== "all" && (
            <Badge variant="secondary">
              Klub: {clubFilter}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6">
          {filteredEnvoys.map((envoy, index) => (
            <div
              key={`${envoy.firstName}-${envoy.lastName}-${envoy.photo}`}
              ref={
                index === filteredEnvoys.length - 1 ? lastEnvoyElementRef : null
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