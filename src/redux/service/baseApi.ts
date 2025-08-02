
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/proxy",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token using the existing refresh API
    const refreshResult = await fetch("/api/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (refreshResult.ok) {
      const refreshData = await refreshResult.json();

      // Store the new token
      api.dispatch({
        type: "auth/updateTokens",
        payload: {
          accessToken: refreshData.accessToken,
          refreshToken:
            refreshData.refreshToken ||
            (api.getState() as RootState).auth.refreshToken,
        },
      });

      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout the user
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
}
// Base API setup
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customer", "Account"], 
  endpoints: () => ({}),
});
