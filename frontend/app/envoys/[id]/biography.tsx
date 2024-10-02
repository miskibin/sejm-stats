import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface EnvoyBiographyProps {
  biography: string;
  biographySource: string;
}

const EnvoyBiography: React.FC<EnvoyBiographyProps> = ({ biography, biographySource }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-2xl font-bold">Biografia</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {biography.length > 1500 ? `${biography.slice(0, 1500)}...` : biography}
        </p>
        <Button variant="outline" className="w-full py-0 my-2" asChild>
          <a href={biographySource} target="_blank" rel="noopener noreferrer">
            Czytaj więcej <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnvoyBiography;