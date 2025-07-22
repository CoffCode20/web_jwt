"use client";

import { useGetCarByIdQuery } from "@/redux/service/car/car";
import Image from "next/image";

type carId = {
  carId: string;
};

export default function CarDetailComponent({ carId }: carId) {
  const { data, isLoading, error } = useGetCarByIdQuery(carId);
  console.log(isLoading);
  console.log(error);
  return (
    <div>
      {
        <div>
          <p>{data?.make}</p>
          <p>{data?.description}</p>
          <Image
            src={data?.image || ""}
            width={250}
            height={250}
            alt={data?.model || ""}
          />
        </div>
      }
    </div>
  );
}
