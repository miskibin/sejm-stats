import "server-only";
import { Act, Club, Interpellation, Committee } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function fetchAllPaginated<T>(
  endpoint: string,
  pageSize: number = 10000
): Promise<T[]> {
  let allItems: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `${API_URL}/${endpoint}/?page=${page}&page_size=${pageSize}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint} data`);
    }

    const data: PaginatedResponse<T> = await res.json();
    allItems = [...allItems, ...data.results];
    hasMore = !!data.next;
    page++;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return allItems;
}

export async function fetchAllActs(pageSize: number = 10000): Promise<Act[]> {
  return fetchAllPaginated<Act>("acts", pageSize);
}

export async function fetchAllInterpellations(
  pageSize: number = 1000
): Promise<Interpellation[]> {
  return fetchAllPaginated<Interpellation>("interpellations", pageSize);
}


export async function fetchAllCommittees(
  pageSize: number = 10000
): Promise<Committee[]> {
  return fetchAllPaginated<Committee>("committees", pageSize);
}

export async function fetchAllClubs(pageSize: number = 1000): Promise<Club[]> {
  return fetchAllPaginated<Club>("clubs", pageSize);
}

export async function fetchAllKeywords(pageSize: number = 1000): Promise<string[]> {
  return fetchAllPaginated<string>("keywords", pageSize);
}
export async function fetchAllPublishers(pageSize: number = 1000): Promise<string[]> {
  return fetchAllPaginated<string>("publishers", pageSize);
}

// Keep other functions as they are if they don't follow the same pattern
export async function fetchHomeData() {
  const res = await fetch(`${API_URL}/home`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error("Failed to fetch home data");
  }

  return res.json();
}

export async function fetchEnvoys(page: number = 1) {
  const res = await fetch(`${API_URL}/envoys/?page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch envoys data");
  }

  return res.json();
}
