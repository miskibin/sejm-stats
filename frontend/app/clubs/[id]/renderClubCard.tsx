"use client ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Badge,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Vote,
} from "lucide-react";
import Image from "next/image";
export function renderClubCard(
  club: any,
  formatNumber: (num: number) => string
) {
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg">
      <CardHeader className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          {club.id && (
            <div className="border-4 border-white rounded-md bg-white p-1">
              <Image
                src={`/media/club_logos/${club.id}.jpg`}
                alt={club.id}
                width={48}
                height={48}
              />
            </div>
          )}
          <div>
            <CardTitle className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">
              {club.id}
            </CardTitle>
            <h2 className="text-xl font-semibold leading-tight text-gray-700 dark:text-gray-300">
              {club.name}
            </h2>
          </div>
        </div>
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Członkowie: {club.membersCount}</span>
        </Badge>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-t-3xl shadow-inner bg-gray-50 dark:bg-gray-800">
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Mail className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <a href={`mailto:${club.email}`} className="hover:underline">
              {club.email}
            </a>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Phone className="w-5 h-5 text-green-500 dark:text-green-400" />
            <a
              href={`tel:${club.phone || club.fax}`}
              className="hover:underline"
            >
              {club.phone || club.fax}
            </a>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center space-x-2 mb-3">
            <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span>Dodatkowe informacje</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg flex flex-col items-center justify-center">
              <MessageSquare className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mb-1" />
              <p className="font-medium">Interpelacje</p>
              <p className="text-lg font-bold">{club.interpellation_count}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg flex flex-col items-center justify-center">
              <FileText className="w-6 h-6 text-red-500 dark:text-red-400 mb-1" />
              <p className="font-medium">Procesy</p>
              <p className="text-lg font-bold">{club.process_count}</p>
            </div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-gray-600 dark:text-gray-300 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Vote className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <span className="font-medium">Głosy wyborcze:</span>
            </div>
            <span className="text-lg font-bold">
              {formatNumber(club.total_votes_number)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
