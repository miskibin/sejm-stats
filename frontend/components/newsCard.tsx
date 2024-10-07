import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  id: number;
  title: string;
  image: string | null;
}

const NewsCard: React.FC<NewsCardProps> = ({ id, title, image }) => {

  return (
    <Card className="overflow-hidden">
      <Link href={`/articles/${id}`} className="group">
        <div className="relative aspect-video w-full">
          {image ? (
            <Image src={image} alt={title} layout="fill" objectFit="cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 transition-all duration-300" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-semibold text-white text-lg leading-tight group-hover:underline">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NewsCard;
