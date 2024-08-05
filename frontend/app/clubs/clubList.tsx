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
              href={`/club/${club.id}`}
              className={`flex items-center p-2 rounded border transition-all duration-300 hover:shadow-md`}
              style={{
                background: `linear-gradient(90deg, rgba(120,120,120,0.2) ${
                  (club.membersCount / 460) * 100
                }%, transparent ${(club.membersCount / 460) * 100}%)`,
              }}
            >
              <span className="bg-white rounded p-1 mr-4">
                {club.photo_url && (
                  <Image
                    src={`/media/club_logos/${club.id}.jpg`}
                    alt={club.id}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                )}
              </span>
              <div>
                <h5 className="font-bold">{club.id}</h5>
                <p className="text-sm">{club.name}</p>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default ClubsList;