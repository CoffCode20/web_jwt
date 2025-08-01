import { baseApi } from "../baseApi";

export type CustomerResponse = {
  fullName: string;
  dob: string;
  customerSegment:string;
  email: string;
  gender: string;
  phone: string;
  remark: string;
};

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<CustomerResponse[], void>({
      query: () => "/customers",
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery } = customerApi;
