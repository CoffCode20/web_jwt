"use client";

import { useGetCustomersQuery } from "@/redux/service/customer/customer";

export default function CustomerList() {
  const { data: customers, isLoading, error } = useGetCustomersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading customers.</p>;

  return (
    <ul className="ml-3">
      {customers?.map((customer, index) => (
        <li key={index}>
          {customer.fullName} ({customer.gender}) - {customer.email}
        </li>
      ))}
    </ul>
  );
}
