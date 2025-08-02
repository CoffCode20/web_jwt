"use client";

import { Button } from "@/components/ui/button"; // Optional, use your button styling
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function ButtonTestKeycloak() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuth = !!session;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex gap-4 items-center">
      {isAuth ? (
        <>
          <Link href="/dashboard">
            <Button className="mt-2 ml-1.5" variant="outline">
              Dashboard
            </Button>
          </Link>
          <Button
            className="mt-2 ml-1.5"
            variant="destructive"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          className="mt-2 ml-1.5"
          variant="default"
          onClick={() => signIn("keycloak")}
        >
          Sign In with Keycloak
        </Button>
      )}
    </div>
  );
}
