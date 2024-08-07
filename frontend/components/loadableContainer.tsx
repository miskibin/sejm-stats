import React, { Suspense } from "react";
import { SkeletonComponent } from "./ui/skeleton-page";

interface LoadableContainerProps {
  children: React.ReactNode;
  className?: string; 
}

const LoadableContainer: React.FC<LoadableContainerProps> = ({ children, className }) => {
  return (
    <div className={`mx-auto bg-white rounded shadow-md my-4 md:mx-3 2xl:mx-16 md:px-4 max-md:px-1 py-3 ${className}`}>
      <Suspense fallback={<SkeletonComponent />}>{children}</Suspense>
    </div>
  );
};

export default LoadableContainer;
