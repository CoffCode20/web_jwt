export type CarResponseType = {
  make: string;
  model: string;
  price: number;
  year: number;
  description: string;
  image: string;
};

export type CreateCarType = {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  color: string;
  fuel_type: string;
  transmission: string;
  image: string;
};

export type UpdateCarType = {
  make: string;
  model: string;
  year: 0;
  price: 0;
  mileage: 0;
  description: string;
  color: string;
  fuel_type: string;
  transmission: string;
  image: string;
  is_sold: boolean;
};
