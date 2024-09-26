"use client";

import { Club } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

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
              className="flex items-center p-3 rounded-lg dark:bg-gray-800 bg-white dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="relative w-10 h-10 mr-3 overflow-hidden rounded-md dark:bg-white bg-gray-100 p-1">
                <Image
                  src={`/media/club_logos/${club.id}.jpg`}
                  alt={club.id}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="flex-grow">
                <h5 className="text-lg font-semibold">{club.id}</h5>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-400">
                  {club.membersCount}
                </span>
                <p className="text-xs text-gray-400">mandatów</p>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default ClubsList;
