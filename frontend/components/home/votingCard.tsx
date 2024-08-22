import React from "react";
import Link from "next/link";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { truncateWords } from "@/utils/text";
import { Card } from "../ui/card";

interface VotingCardProps {
  voting: {
    id: number;
    success: boolean;
    title: string;
    category: string;
    topic: string;
  };
}

const VotingCard: React.FC<VotingCardProps> = ({ voting }) => {
  const isImportant = voting.category === "WHOLE_PROJECT";

  return (
    <Link href={`/votings/${voting.id}`} className="block">
      <Card 
        className={`
          relative overflow-hidden transition-all duration-300 ease-in-out
          ${isImportant ? 'border-2 border-yellow-400' : ''} dark:hover:bg-gray-600

        `}
      >
        <div className={`
          absolute top-0 left-0 w-1 h-full
          ${voting.success ? 'bg-green-500' : 'bg-red-500'}
        `}></div>
        
        <div className="p-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-medium  pr-2 flex-grow">{truncateWords(voting.title, 22)}</h3>
            <div className="flex-shrink-0 w-5 flex flex-col items-center justify-between">
              {isImportant && (
                <AlertTriangle className="h-5 w-3 text-yellow-500 mb-1" />
              )}
              {voting.success ? (
                <CheckCircle className="text-green-500 h-4 w-4" />
              ) : (
                <XCircle className="text-red-500 h-4 w-4" />
              )}
            </div>
          </div>
          
          <p className="text-xs dark:text-gray-300 text-gray-700">{voting.topic}</p>
          
        </div>
      </Card>
    </Link>
  );
};

export default VotingCard;