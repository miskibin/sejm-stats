import Image from "next/image";
import Link from "next/link";

interface EnvoyCardProps {
  id: number;
  firstName: string;
  lastName: string;
  photo: string | null;
  clubPhoto: string;
  active: boolean;
  numberOfVotes: number;
}

export const EnvoyCard: React.FC<EnvoyCardProps> = ({
  id,
  firstName,
  lastName,
  photo,
  clubPhoto,
  active,
  numberOfVotes,
}) => {
  return (
    <Link href={`/envoy/${id}`} className="block  ">
      <div
        className={`flex rounded-lg shadow-md overflow-hidden bg-gray-900 transition-transform hover:scale-105 ${
          numberOfVotes > 100000 ? "border-t-4 border-blue-500" : ""
        }`}
      >
        <div className="w-1/3">
          <Image
            src={photo || "/placeholder.jpg"}
            alt={`${firstName} ${lastName}`}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-lg font-semibold truncate">{`${firstName} ${lastName}`}</h2>
          <div className="mt-2">
            <Image
              src={clubPhoto}
              alt="Club logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          {active && numberOfVotes > 100 && (
            <span className="mt-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              aktywny/a
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
