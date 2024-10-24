"use client";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import RichTextEditor from "@/components/editor/text-editor";

function App() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Zaloguj się</CardTitle>
            <CardDescription>
              Musisz być zalogowany, aby utworzyć artykuł.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => signIn()} className="w-full">
              Zaloguj się
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center m-2 p-1">
    <Card className="min-w-[60vw]">
      <RichTextEditor />

    </Card>
    </div>
  );
}

export default App;
