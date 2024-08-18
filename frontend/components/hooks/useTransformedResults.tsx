import { useMemo } from "react";

const useTransformedResults = (results: any[]) => {
  return useMemo(() => {
    return results.map((result) => ({
      ...result,
      title: (
        <div className="result-title">
          {result.title}
          <span className="text-muted">
            {result.description ? result.description : result.topic}
          </span>
        </div>
      ),
    }));
  }, [results]);
};

export default useTransformedResults;