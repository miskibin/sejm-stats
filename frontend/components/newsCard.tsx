import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsCardProps {
  id: number;
  title: string;
  image: string | null;
  size?: "small" | "medium" | "large";
}

export const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  image,
  size = "small",
}) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-2 row-span-1 sm:col-span-1 sm:row-span-2",
    large: "col-span-2 row-span-2",
  };

  return (
    <Card className={`overflow-hidden ${sizeClasses[size]} h-full`}>
      <Link href={`/articles/${id}`} className="group block h-full">
        <div className="relative w-full h-full">
          {image ? (
            <Image 
              src={image} 
              alt={title} 
              layout="fill" 
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-gray-400">Brak obrazu</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3
              className={`font-semibold text-white leading-tight group-hover:underline ${
                size === "large" ? "text-2xl" : size === "medium" ? "text-xl" : "text-lg"
              }`}
            >
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </Card>
  );
};
