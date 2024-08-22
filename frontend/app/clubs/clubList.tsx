import React from "react";
import Link from "next/link";
import { Club } from "@/lib/types";

interface ClubsListProps {
  clubs: Club[];
}

const ClubsList: React.FC<ClubsListProps> = ({ clubs }) => {
  return (
    <ul className="space-y-2">
      {clubs
        .sort((a: Club, b: Club) => b.membersCount - a.membersCount)
        .map((club: Club) => (
          <li key={club.id}>
            <Link
              href={`/clubs/${club.id.replace(/\./g, "")}`}
              className="flex items-center p-2 px-4 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center overflow-hidden">
                {club.photo_url ? (
                  <img
                    src={`/media/club_logos/${club.id}.jpg`}
                    alt={club.id}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/no-picture.jpg";
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold">{club.id.charAt(0)}</span>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{club.id}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {club.membersCount} mandatów
                </p>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default ClubsList;
