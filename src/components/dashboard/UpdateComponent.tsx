"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "@/components/ui/switch";

const updateCarSchema = z.object({
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.coerce
    .number()
    .gte(1886)
    .lte(new Date().getFullYear(), {
      message: `Year must be between 1886 and ${new Date().getFullYear()}`,
    }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  mileage: z.coerce
    .number()
    .nonnegative({ message: "Mileage cannot be negative" }),
  description: z.string().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  fuel_type: z.string().min(1, { message: "Fuel type is required" }),
  transmission: z.string().min(1, { message: "Transmission is required" }),
  image: z.string().url({ message: "Must be a valid image URL" }),
  is_sold: z.boolean(),
});

export default function UpdateCarFormComponent() {
  const form = useForm<z.infer<typeof updateCarSchema>>({
    resolver: zodResolver(updateCarSchema) as any,
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      description: "",
      color: "",
      fuel_type: "",
      transmission: "",
      image: "",
      is_sold: false,
    },
  });

  async function onSubmit(values: z.infer<typeof updateCarSchema>) {
    try {
      const res = await fetch("/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        console.error("Failed to update car");
      }

      const data = await res.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fields = [
    "make",
    "model",
    "year",
    "price",
    "mileage",
    "color",
    "fuel_type",
    "transmission",
    "image",
  ] as const;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 capitalize">
                    {fieldName}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={
                        ["year", "price", "mileage"].includes(fieldName)
                          ? "number"
                          : "text"
                      }
                      placeholder={`Enter ${fieldName}`}
                      className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the car in detail..."
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md min-h-[100px]"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_sold"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel className="text-sm font-medium text-gray-700">
                Sold
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-xs mt-1" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Update Car
          </Button>
        </div>
      </form>
    </Form>
  );
}
