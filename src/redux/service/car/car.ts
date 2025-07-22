import { CarResponseType, CreateCarType } from "@/lib/car/CarType";
import { UpdateCarType } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://car-nextjs-api.cheatdev.online",
  }),
  endpoints: (builder) => ({
    // get cars by using get method
    getCars: builder.query<CarResponseType[], { page: number; limit: number }>({
      query: ({ page, limit }) => `cars?skip=${page}&limit=${limit}`,
    }),
    // get car by id
    getCarById: builder.query<CarResponseType, string>({
      query: (id) => `cars/${id}`,
    }),
    //create
    createCar: builder.mutation<
      CreateCarType,
      { newCar: CreateCarType; accessToken: string }
    >({
      query: ({ newCar, accessToken }) => ({
        url: "/cars",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        // body is the new car object
        body: newCar,
      }),
    }),
    // update car
    updateCar: builder.mutation<
      UpdateCarType,
      { id: string; updatedCar: UpdateCarType; accessToken: string }
    >({
      query: ({ id, updatedCar, accessToken }) => ({
        url: `/cars/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: updatedCar,
      }),
    }),
    // delete car
    deleteCar: builder.mutation<
      { message: string },
      { id: string; accessToken: string }
    >({
      query: ({ id, accessToken }) => ({
        url: `/cars/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const {
  useGetCarsQuery,
  useGetCarByIdQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApi;
