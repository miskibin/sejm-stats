import {
  useQuery,
  QueryKey,
  UseQueryOptions,
  QueryClient,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 60 * 1000, // 24 hours
      gcTime: 7 * 1 * 60 * 60 * 1000, // 7 days
    },
  },
});

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      next: { revalidate: 1 * 60 * 60 }, // 24 hours
    }
  );
  if (!response.ok) throw new Error("Błąd podczas pobierania danych");
  return response.json();
}

export function useFetchData<T>(
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error, T, QueryKey>, "queryKey" | "queryFn">
) {
  return useQuery<T, Error>({
    queryKey: [endpoint],
    queryFn: () => fetchData<T>(endpoint),
    staleTime: 1 * 60 * 60 * 1000,
    gcTime: 7 * 1 * 60 * 60 * 1000,
    ...options,
  });
}

// Utility function to prefetch data
export function prefetchData<T>(endpoint: string) {
  return queryClient.prefetchQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData<T>(endpoint),
  });
}

// Utility function to invalidate cache
export function invalidateCache(endpoint: string) {
  return queryClient.invalidateQueries({ queryKey: [endpoint] });
}
export async function fetchEnvoys(page: number = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/envoys/?page=${page}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch envoys data");
  }

  return res.json();
}
