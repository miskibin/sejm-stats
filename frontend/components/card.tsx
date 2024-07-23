import React, { Suspense } from "react";
import { LoadingSpinner } from "./ui/spinner";

interface LoadableContainerProps {
  children: React.ReactNode;
}

const LoadableContainer: React.FC<LoadableContainerProps> = ({ children }) => {
  return (
    <div className="container mx-auto bg-white rounded shadow-md my-4 p-4">
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </div>
  );
};

export default LoadableContainer;
