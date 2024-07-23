import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  count: number;
  color: string;
  url: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, color, url }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 transition-transform hover:scale-105 cursor-pointer">
      <p className="text-gray-600 mb-2">{title}</p>
      <h3 className={`text-3xl font-bold ${color}`}>{count}</h3>
      <Link href={url} className="text-blue-500 mt-4 inline-block group">
        Pokaż więcej <FaArrowRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default StatCard;