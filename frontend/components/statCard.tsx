import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  color: "default" | "secondary" | "destructive" | "outline";
  url: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, color, url }) => {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-2">{title}</p>
        <p
          className={`text-3xl font-bold px-3 py-1 ${
            color === "default"
              ? "text-red-500"
              : color === "secondary"
              ? "text-blue-500"
              : color === "destructive"
              ? "text-blue-500"
              : color === "outline"
              ? "text-gray-500"
              : ""
          }`}
        >
          {count.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link
          href={url}
          className="text-sm text-primary hover:underline inline-flex items-center group"
        >
          Pokaż więcej
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
