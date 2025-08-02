"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users } from "lucide-react";
import { useMemo } from "react";

import { useGetAccountsQuery } from "@/redux/service/account/account";
import { useGetCustomersQuery } from "@/redux/service/customer/customer";
import Link from "next/link";

export default function DashboardPage() {
  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
  } = useGetCustomersQuery();
  const {
    data: accountsData,
    isLoading: accountsLoading,
    error: accountsError,
  } = useGetAccountsQuery();

  // Normalize data arrays
  const customers = customersData ?? [];
  const accounts = accountsData?.data ?? [];

  // Memoized computations for performance
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + (account.balance ?? 0), 0);
  }, [accounts]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your banking dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/customers">
            <Button variant="outline">View Customer Data</Button>
          </Link>
          <Link href="/dashboard/accounts">
            <Button>View Account Data</Button>
          </Link>
        </div>
      </div>

      {/* Error Messages */}
      {(customersError || accountsError) && (
        <div className="text-red-500 space-y-1">
          {customersError && <p>Failed to load customers data.</p>}
          {accountsError && <p>Failed to load accounts data.</p>}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customersLoading ? "Loading..." : customers.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Accounts
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountsLoading ? "Loading..." : accounts.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
