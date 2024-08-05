import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  title: string;
  category: string;
  imageUrl: string;
  link: string;
  isWide?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, category, imageUrl, link, isWide = false }) => {
  return (
    <Card className={`overflow-hidden ${isWide ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <Link href={link} className="group">
        <div className="relative aspect-video w-full">
          <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 transition-all duration-300" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-sm font-medium text-white/80 mb-2 bg-black/50 inline-block px-2 py-1 rounded">{category}</p>
            <h3 className={`font-semibold text-white ${isWide ? 'text-2xl' : 'text-lg'} leading-tight group-hover:underline`}>{title}</h3>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default NewsCard;