/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setAccessToken } from "../feature/authSlice";
import { RootState } from "../store";

// BaseQuery that targets the proxy route in Next.js
const proxyBaseQuery = fetchBaseQuery({
  baseUrl: "/api/proxy",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrapper for automatic re-authentication if 401/403 occurs
const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  // Initial request
  let result = await proxyBaseQuery(args, api, extraOptions);

  // If unauthorized, attempt token refresh
  if (result.error?.status === 401 || result.error?.status === 403) {
    try {
      const res = await fetch("/api/refresh", {
        method: "GET",
        credentials: "include", // Include cookies (refresh token)
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Token refreshed:", data);

        // Update token in Redux store
        api.dispatch(setAccessToken(data.accessToken));

        // Retry original request with new token
        result = await proxyBaseQuery(args, api, extraOptions);
      } else {
        // Logout on failure
        const logoutRes = await fetch("/api/logout", {
          method: "POST",
          credentials: "include",
        });
        const logoutData = await logoutRes.json();
        console.log("Logout response:", logoutData);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  return result;
};

// Base API setup
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Cars"], // You can add more for cache invalidation
  endpoints: () => ({}),
});
