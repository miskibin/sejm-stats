import React from "react";
import Link from "next/link";
import { FaCheck, FaTimes, FaExclamationCircle } from "react-icons/fa";
import { truncateWords } from "@/utils/text";
import { Card } from "../ui/card";
interface VotingCardProps {
  voting: {
    id: number;
    success: boolean;
    title: string;
    category: string;
  };
}

const VotingCard: React.FC<VotingCardProps> = ({ voting }) => {
  return (
    <Link
      href={`/votings/${voting.id}`}
      className="block "
    >
      <Card className="flex items-center p-4 hover:shadow-md transition-shadow dark:hover:bg-gray-700">
        <div className="flex-shrink-0 mr-4">
          {voting.success ? (
            <FaCheck className="text-green-500 text-2xl" />
          ) : (
            <FaTimes className="text-red-500 text-2xl" />
          )}
        </div>
        <div className="flex-grow">
          <p className="">{truncateWords(voting.title, 15)}</p>
        </div>
        {voting.category === "WHOLE_PROJECT" && (
          <FaExclamationCircle className="text-blue-500 text-3xl" />
        )}
      </Card>
    </Link>
  );
};

export default VotingCard;
