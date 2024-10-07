"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Clock } from "lucide-react";

import { fetchArticle, fetchLatestArticles } from "@/lib/api";
import { Article, ArticleListItem } from "@/lib/types";
import { useParams } from "next/navigation";
import { slateToHtml } from "@/lib/slate-to-html";

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };

  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
    enabled: !!id,
  });

  const { data: latestArticles } = useQuery({
    queryKey: ["latestArticles"],
    queryFn: fetchLatestArticles
  });
  const articleContent = slateToHtml(Array.isArray(article?.content) ? article.content : []);
  if (isLoading) return <ArticleSkeleton />;
  if (error)
    return <div>Error loading article: {(error as Error).message}</div>;
  if (!article) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <main className="lg:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {article.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(article.created_at), "M/d, yyyy")}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(article.updated_at), "M/d, yyyy")}
                </span>
              </div>
            </CardHeader>
            <CardContent>

              <div
                className="max-w-none"
                dangerouslySetInnerHTML={{
                  __html: articleContent,
                }}
              />
            </CardContent>
          </Card>
        </main>
        <aside className="lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Najnowsze artykuły</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {latestArticles?.map((latestArticle: ArticleListItem) => (
                  <li key={latestArticle.id}>
                    <Link
                      href={`/articles/${latestArticle.id}`}
                      className="flex items-center space-x-3 group"
                    >
                      {latestArticle.image && (
                        <div className="flex-shrink-0">
                          <Image
                            src={latestArticle.image}
                            alt={latestArticle.title}
                            width={60}
                            height={60}
                            className="rounded"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                          {latestArticle.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(
                            new Date(latestArticle.created_at),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

const ArticleSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col lg:flex-row gap-8">
      <main className="lg:w-2/3">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </main>
      <aside className="lg:w-1/3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>
    </div>
  </div>
);

export default ArticleDetailPage;
