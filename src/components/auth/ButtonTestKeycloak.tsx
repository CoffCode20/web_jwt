"use client";
import { signIn, signOut } from "next-auth/react";

export default function ButtonTestKeycloak() {
  return (
    <div>
      <button onClick={() => signIn("keycloak")}>SignIn</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
