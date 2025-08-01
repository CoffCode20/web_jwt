import ButtonTestKeycloak from "@/components/auth/ButtonTestKeycloak";
import AuthNav from "@/components/AuthNav";
import { CustomerTable } from "@/components/customer/CustomerTable";
import { authOptions } from "@/lib/auth/next-auth-options";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
        <h1 className="text-3xl font-bold text-center">
          Welcome to Customer Listings
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          Discover a wide range of cars, create your own listings, or manage
          your account.
        </p>
        <CustomerTable />
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <AuthNav />
        </div>
      </div>

      <div>
        {/* keycloak */}
        {!!session && <pre>{JSON.stringify(session, null, 2)}</pre>}
        {!!session}
        <ButtonTestKeycloak />
      </div>
    </>
  );
}
