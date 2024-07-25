import { fetchAllKeywords, fetchAllPublishers } from './api';

export async function DataFetcher() {
  const keywords = await fetchAllKeywords();
  const publishers = await fetchAllPublishers();

  return { keywords, publishers };
}