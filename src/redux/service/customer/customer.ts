/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomerType } from "@/lib/customer/CustomerType";
import { baseApi } from "../baseApi";

export interface Customer {
  id?: string;
  fullName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  remark?: string;
  nationalCardId: string;
  customerSegment: string;
  isActive?: boolean;
}

export interface SingleCustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query<CustomerType[], void>({
      query: () => `/customers`,
      providesTags: ["Customer"],
    }),

    // Get customer by phone number
    getCustomerByPhone: builder.query<SingleCustomerResponse, string>({
      query: (phoneNumber) => `/customers/${phoneNumber}`,
      providesTags: (result, error, phoneNumber) => [
        { type: "Customer", id: phoneNumber },
      ],
    }),

    // Create new customer
    createCustomer: builder.mutation<
      SingleCustomerResponse,
      Omit<Customer, "id">
    >({
      query: (customer) => ({
        url: "/customers",
        method: "POST",
        body: customer,
      }),
      invalidatesTags: ["Customer"],
    }),

    // Update customer by phone number
    updateCustomer: builder.mutation<
      SingleCustomerResponse,
      { phoneNumber: string; updates: Partial<Customer> }
    >({
      query: ({ phoneNumber, updates }) => ({
        url: `/customers/${phoneNumber}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { phoneNumber }) => [
        "Customer",
        { type: "Customer", id: phoneNumber },
      ],
    }),

    // Delete customer by phone number
    deleteCustomer: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (phoneNumber) => ({
        url: `/customers/${phoneNumber}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),

    // Disable customer by phone number
    disableCustomer: builder.mutation<SingleCustomerResponse, string>({
      query: (phoneNumber) => ({
        url: `/customers//disable-customer/${phoneNumber}`,
        method: "PUT",
        body: { isActive: false },
      }),
      invalidatesTags: (result, error, phoneNumber) => [
        "Customer",
        { type: "Customer", id: phoneNumber },
      ],
    }),

    // Enable customer by phone number
    enableCustomer: builder.mutation<SingleCustomerResponse, string>({
      query: (phoneNumber) => ({
        url: `/customers/${phoneNumber}`,
        method: "PUT",
        body: { isActive: true },
      }),
      invalidatesTags: (result, error, phoneNumber) => [
        "Customer",
        { type: "Customer", id: phoneNumber },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByPhoneQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useDisableCustomerMutation,
  useEnableCustomerMutation,
} = customerApi;
