import ButtonTestKeycloak from "@/components/auth/ButtonTestKeycloak";
import { authOptions } from "@/lib/auth/next-auth-options";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <ButtonTestKeycloak />
    </>
  );
}
