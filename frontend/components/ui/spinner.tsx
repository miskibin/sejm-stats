import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const SkeletonLoader: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-28" />
      </CardFooter>
    </Card>
  );
};

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[87vh]  p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
};