"use client";

import { Club } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface ClubsListProps {
  clubs: Club[];
}

const ClubsList: React.FC<ClubsListProps> = ({ clubs }) => {
  return (
    <ul className="space-y-4">
      {clubs
        .sort((a: Club, b: Club) => b.membersCount - a.membersCount)
        .map((club: Club, index: number) => (
          <motion.li
            key={club.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={`/clubs/${club.id.replace(/\./g, "")}`}
              className="flex items-center p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-300"
            >
              <div className="relative w-16 h-16 mr-4 overflow-hidden rounded-full border-2 border-gray-200">
                <ImageWithFallback
                  src={`/media/club_logos/${club.id}.jpg`}
                  alt={club.id}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex-grow">
                <h5 className="text-xl font-semibold mb-1">{club.id}</h5>
                <p className="text-sm text-gray-600">{club.name}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-500">{club.membersCount}</span>
                <p className="text-sm text-gray-500">mandatów</p>
              </div>
            </Link>
          </motion.li>
        ))}
    </ul>
  );
};

const ImageWithFallback: React.FC<React.ComponentProps<typeof Image>> = (props) => {
  const [imgSrc, setImgSrc] = useState(props.src);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => setImgSrc("/no-picture.jpg")}
    />
  );
};

export default ClubsList;