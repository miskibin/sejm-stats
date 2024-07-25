import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface EnvoyCardProps {
  firstName: string;
  lastName: string;
  educationLevel: string;
  numberOfVotes: number;
  photo: string;
  clubPhoto: string;
}

const EnvoyCard: React.FC<EnvoyCardProps> = ({
  firstName,
  lastName,
  educationLevel,
  numberOfVotes,
  photo,
  clubPhoto,
}) => {
  // TODO THIS IS TEMPORARY FIX
  return (
    <Card className="hover:shadow-lg transition-shadow bg-neutral-50  border-2 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-row">
          <div className="w-1/3 relative">
            <Image
              src={`${photo}`}
              alt={`${firstName} ${lastName}`}
              width={120}
              height={160}
              className="object-cover h-full w-full"
            />
          </div>
          <div className="flex-grow p-4">
            <div className="flex items-center mb-2">
              <h3 className="font-semibold text-lg mr-2">{`${firstName} ${lastName}`}</h3>
              <Image
                src={`${clubPhoto}`}
                alt="Club logo"
                width={40}
                height={40}
                className="rounded-sm  border-gray-200"
              />
            </div>
            <p className="text-sm text-gray-600 mb-1">{educationLevel}</p>
            <p className="text-sm font-medium">
              Liczba głosów: {numberOfVotes.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvoyCard;
