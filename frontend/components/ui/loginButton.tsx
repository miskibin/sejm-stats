import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./button";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="destructive">
        Wyloguj
      </Button>
    );
  }
  return (
    <Button onClick={() => signIn("google")} variant="outline" >
      Zaloguj się (dostępne w krótce)
    </Button>
  );
}
