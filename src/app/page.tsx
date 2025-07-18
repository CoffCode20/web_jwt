import AuthNav from "@/components/AuthNav";
import { DataTableComponent } from "@/components/TableData";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-3xl font-bold text-center">
        Welcome to Car Listings
      </h1>
      <p className="text-muted-foreground text-center max-w-md">
        Discover a wide range of cars, create your own listings, or manage your
        account.
      </p>
      <DataTableComponent />
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <AuthNav />
      </div>
    </div>
  );
}
