import {
  useQuery,
  QueryKey,
  UseQueryOptions,
  QueryClient,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import { Article, ArticleListItem } from "./types";

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
export async function sendArticleToApi(articleData: {
  title: string;
  content: any;
  image: string | null;
  author: string;
}) {
  console.log("Sending article to API", articleData);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });

  if (!response.ok) {
    throw new Error("Failed to save article");
  }

  return response.json();
}

export const fetchArticle = async (id: string): Promise<Article> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`
  );
  return response.data;
};

export const fetchLatestArticles = async (): Promise<ArticleListItem[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/`
  );
  return response.data.results;
};
