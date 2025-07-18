"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

// Schema
const carFormSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().int().gte(1886).lte(new Date().getFullYear()),
  price: z.coerce.number().positive(),
  mileage: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  color: z.string().min(1),
  fuel_type: z.string().min(1),
  transmission: z.string().min(1),
  image: z.string().url({ message: "Must be a valid image URL" }),
});

export default function CreateCarFormComponent() {
  const form = useForm<z.infer<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema) as never,
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
    },
  });

  async function onSubmit(values: z.infer<typeof carFormSchema>) {
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        console.error("Failed to create car");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
      <div className="w-[500px] border p-8 rounded-lg mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {[
              "make",
              "model",
              "year",
              "price",
              "mileage",
              "color",
              "fuel_type",
              "transmission",
              "image",
            ].map((fieldName) => (
                <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as keyof z.infer<typeof carFormSchema>}
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">{fieldName}</FormLabel>
                          <FormControl>
                            <Input
                                {...field}
                                type={
                                  ["year", "price", "mileage"].includes(fieldName)
                                      ? "number"
                                      : "text"
                                }
                                placeholder={fieldName}
                            />
                          </FormControl>
                        </FormItem>
                    )}
                />
            ))}

            {/* Description */}
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the car..." />
                      </FormControl>
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full">
              Create Car
            </Button>
          </form>
        </Form>
      </div>
  );
}
