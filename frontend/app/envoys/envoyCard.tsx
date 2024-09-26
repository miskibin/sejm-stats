import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface EnvoyCardProps {
  firstName: string;
  lastName: string;
  educationLevel: string;
  numberOfVotes: number;
  photo: string;
  clubPhoto: string;
  id: number;
}

const EnvoyCard: React.FC<EnvoyCardProps> = ({
  firstName,
  lastName,
  educationLevel,
  numberOfVotes,
  photo,
  clubPhoto,
  id,
}) => {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(photo);
  const [clubImgSrc, setClubImgSrc] = useState(clubPhoto);
  const handleClick = () => {
    router.push(`/envoys/${id}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-row">
          <div className="w-1/3 relative">
            <Image
              src={imgSrc}
              alt={`${firstName} ${lastName}`}
              width={120}
              height={160}
              onError={() => setImgSrc("/placeholder.jpg")}
              className="object-cover h-full w-full bg-gray-100"
            />
          </div>
          <div className="flex-grow p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">{`${firstName} ${lastName}`}</h3>
              <p className="text-sm text-gray-600 mb-1">{educationLevel}</p>
              <p className="text-sm font-medium">
                Liczba głosów: {numberOfVotes.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-16 p-2 flex items-start justify-end">
            <Image
              src={clubImgSrc}
              alt="Club logo"
              width={60}
              height={40}
              className="rounded-sm border-gray-200 p-1 bg-gray-100"
              onError={() => setClubImgSrc("/no-picture.jpg")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvoyCard;
