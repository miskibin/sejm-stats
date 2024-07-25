"use client";
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
import EnvoyCard from "./envoyCard";

interface Envoy {
  firstName: string;
  lastName: string;
  educationLevel: string;
  numberOfVotes: number;
  photo: string;
  club_photo: string;
  active: boolean;
}

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
  const [isSearching, setIsSearching] = useState(false);
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
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isSearching &&
          !allEnvoysLoadedRef.current
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, isSearching]
  );

  const fetchEnvoys = async (
    pageNum: number,
    pageSize: number
  ): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/envoys/?page=${pageNum}&page_size=${pageSize}`
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

    const pageSize = isSearching ? totalCount || 500 : PAGE_SIZE;
    const data = await fetchEnvoys(1, pageSize);

    setEnvoys(data.results);
    setTotalCount(data.count);
    setHasMore(!!data.next);

    if (isSearching || data.results.length === data.count) {
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
  }, [isSearching]);

  useEffect(() => {
    if (!isSearching && page > 1 && !allEnvoysLoadedRef.current) {
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
  }, [page, isSearching]);

  useEffect(() => {
    const shouldSearch =
      !!search || educationFilter !== "all" || clubFilter !== "all";
    setIsSearching(shouldSearch);
    if (shouldSearch) {
      loadEnvoys(true); // Force refresh when searching
    } else {
      setPage(1);
      loadEnvoys();
    }
  }, [search, educationFilter, clubFilter]);

  const educationLevels = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(envoys.map((envoy) => envoy.educationLevel))),
    ];
  }, [envoys]);

  const clubs = useMemo(() => {
    return [
      "all",
      ...new Set(
        envoys.map((envoy) => {
          const clubName = envoy.club_photo.split("/").pop()?.split(".")[0];
          return clubName || "Unknown";
        })
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
        clubFilter === "all" || envoy.club_photo.includes(clubFilter);

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
        <h1 className="text-3xl font-bold mb-6">Posłowie</h1>
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
                <SelectItem key={edu} value={edu}>
                  {edu === "all" ? "Wszystkie" : edu}
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
                <SelectItem key={club} value={club}>
                  {club === "all" ? "Wszystkie" : club}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              />
            </div>
          ))}
        </div>
        {isLoading && <p className="text-center mt-4">Ładowanie...</p>}
      </div>
    </LoadableContainer>
  );
}
