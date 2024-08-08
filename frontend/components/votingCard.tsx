import React from "react";
import Link from "next/link";
import { FaCheck, FaTimes, FaExclamationCircle } from "react-icons/fa";
import { truncateWords } from "@/utils/text";
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
      className="block bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300 shadow rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
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
      </div>
    </Link>
  );
};

export default VotingCard;
