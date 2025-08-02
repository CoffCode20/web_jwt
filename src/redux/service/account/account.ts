import { baseApi } from "../baseApi";

export interface Account {
  id?: string;
  actNo: string;
  actName: string;
  actCurrency: string;
  balance: number;
  phoneNumber: string;
  accountType: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AccountResponse {
  success: boolean;
  message: string;
  data: Account[];
}

export interface SingleAccountResponse {
  success: boolean;
  message: string;
  data: Account;
}

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all accounts
    getAccounts: builder.query<AccountResponse, void>({
      query: () => `/accounts`,
      providesTags: ["Account"],
    }),

    // Get account by account number
    getAccountByNumber: builder.query<SingleAccountResponse, string>({
      query: (actNo) => `/accounts/${actNo}`,
      providesTags: (result, error, actNo) => [{ type: "Account", id: actNo }],
    }),

    // Create new account
    createAccount: builder.mutation<SingleAccountResponse, Omit<Account, "id">>(
      {
        query: (account) => ({
          url: "/accounts",
          method: "POST",
          body: account,
        }),
        invalidatesTags: ["Account"],
      }
    ),

    // Update account
    updateAccount: builder.mutation<
      SingleAccountResponse,
      { actNo: string; updates: Partial<Account> }
    >({
      query: ({ actNo, updates }) => ({
        url: `/accounts/${actNo}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { actNo }) => [
        "Account",
        { type: "Account", id: actNo },
      ],
    }),

    // Delete account
    deleteAccount: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (actNo) => ({
        url: `/accounts/${actNo}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Account"],
    }),

    // Disable account
    disableAccount: builder.mutation<SingleAccountResponse, string>({
      query: (actNo) => ({
        url: `/accounts/${actNo}`,
        method: "PUT",
        body: { isActive: false },
      }),
      invalidatesTags: (result, error, actNo) => [
        "Account",
        { type: "Account", id: actNo },
      ],
    }),

    // Enable account
    enableAccount: builder.mutation<SingleAccountResponse, string>({
      query: (actNo) => ({
        url: `/accounts/${actNo}`,
        method: "PUT",
        body: { isActive: true },
      }),
      invalidatesTags: (result, error, actNo) => [
        "Account",
        { type: "Account", id: actNo },
      ],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetAccountByNumberQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useDisableAccountMutation,
  useEnableAccountMutation,
} = accountApi;
