// app/dashboard/customer/page.tsx
"use client";

import { CustomerTable } from "@/components/customer/CustomerTable";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface CustomerPageProps {
  children?: ReactNode; // this will be modal content from nested routes
}

export default function CustomerPage({ children }: CustomerPageProps) {
  const pathname = usePathname();

  // Check if modal route is open by URL (optional)
  const isModalOpen =
    pathname?.endsWith("/create") || pathname?.endsWith("/edit");

  return (
    <div className="m-20">
      <h1 className="text-3xl font-bold mb-6">Customer List</h1>
      <CustomerTable />

      {/* Render modal content from nested route */}
      {children && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {children}
        </div>
      )}
    </div>
  );
}
