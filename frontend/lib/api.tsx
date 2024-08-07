import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
  if (!response.ok) throw new Error("Błąd podczas pobierania danych");
  return response.json();
}

export function useFetchData<T>(
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error, T, QueryKey>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: [endpoint],
    queryFn: () => fetchData<T>(endpoint),
    ...options
  });
}

export async function fetchEnvoys(page: number = 1) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/envoys/?page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch envoys data");
  }

  return res.json();
}