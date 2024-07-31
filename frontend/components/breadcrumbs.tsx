// components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const urlToPolishName: { [key: string]: string } = {
  envoys: "Posłowie",
  clubs: "Kluby parlamentarne",
  votings: "Głosowania",
  processes: "Procesy legislacyjne",
  committees: "Komisje sejmowe",
  interpellations: "Interpelacje",
  acts: "Dziennik ustaw",
  // Add more mappings as needed
};

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  // Don't render breadcrumbs on the home page
  if (pathname === "/") {
    return null;
  }

  const pathSegments = pathname?.split("/").filter((segment) => segment !== "");

  return (
    <nav className="flex px-5 py-3 text-gray-700" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <svg
              className="w-3 h-3 mr-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Strona główna
          </Link>
        </li>
        {pathSegments?.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const polishName = urlToPolishName[segment.replace('-results','')] || segment;

          return (
            <li key={href}>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 mx-1 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {polishName}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    {polishName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
