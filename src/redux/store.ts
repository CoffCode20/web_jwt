import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./service/baseApi";
import { carApi } from "./service/car/car";
import { authReducer } from "./feature/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [carApi.reducerPath]: carApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(baseApi.middleware)
        .concat(carApi.middleware), // ✅ Add this line
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
