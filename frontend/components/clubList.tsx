"use client";

import Image from "next/image";
import Link from "next/link";
import { Club } from "@/lib/api";

interface ClubsListProps {
  clubs: Club[];
}

const ClubsList: React.FC<ClubsListProps> = ({ clubs }) => {
  return (
    <ul className="space-y-2">
      {clubs.sort((a, b) => b.membersCount - a.membersCount).map((club) => (
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
                  src={`/..${club.photo_url}`}
                  alt={club.id}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </span>
            <div>
              <h5 className="font-bold">{club.id}</h5>
              <p className="text-sm">{club.membersCount} posłów</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ClubsList;
