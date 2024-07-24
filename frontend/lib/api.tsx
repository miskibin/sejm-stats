import "server-only";
import { Act, Club, Interpellation } from "./types";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://sejm-stats.pl/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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


export interface ClubsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Club[];
}

export async function fetchClubs(): Promise<ClubsResponse> {
  const res = await fetch(`${API_URL}/clubs/`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error("Failed to fetch clubs data");
  }

  return res.json();
}


export interface InterpellationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Interpellation[];
}

export async function fetchAllInterpellations(): Promise<Interpellation[]> {
  let allInterpellations: Interpellation[] = [];
  let nextPage: string | null = `${API_URL}/interpellations/`;

  while (nextPage) {
    const res = await fetch(nextPage, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch interpellations data");
    }

    const data: InterpellationsResponse = await res.json();
    allInterpellations = [...allInterpellations, ...data.results];
    nextPage = data.next;
  }

  return allInterpellations;
}


export interface ActsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Act[];
}

// Add this function to fetch all acts
export async function fetchAllActs(): Promise<Act[]> {
  let allActs: Act[] = [];
  let nextPage: string | null = `${API_URL}/acts/`;

  while (nextPage) {
    const res = await fetch(nextPage, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch acts data");
    }

    const data: ActsResponse = await res.json();
    allActs = [...allActs, ...data.results];
    nextPage = data.next;
  }

  return allActs;
}

import { Committee } from "./types";

// Add this interface
export interface CommitteesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Committee[];
}

// Add this function to fetch all committees
export async function fetchAllCommittees(): Promise<Committee[]> {
  let allCommittees: Committee[] = [];
  let nextPage: string | null = `${API_URL}/committees/`;

  while (nextPage) {
    const res = await fetch(nextPage, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch committees data");
    }

    const data: CommitteesResponse = await res.json();
    allCommittees = [...allCommittees, ...data.results];
    nextPage = data.next;
  }

  return allCommittees;
}