import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaGoogle } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image} alt={session.user.name} />
              <AvatarFallback>{session.user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{session.user.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Ustawienia</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>Wyloguj</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <Button
      onClick={() => signIn("google")}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <FaGoogle className="h-4 w-4" />
      <span>Zaloguj z Google</span>
    </Button>
  );
}
