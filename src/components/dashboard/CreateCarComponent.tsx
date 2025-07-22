"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuthToken, getRefreshToken, logout } from "@/lib/auth";
import { CreateCarType } from "@/lib/car/CarType";
import { useCreateCarMutation } from "@/redux/service/car/car";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import { z } from "zod";

export default function CreateCarFormWithAuth() {
  const [createCar, { data, isLoading, isError, error }] =
    useCreateCarMutation();
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Zod schema
  const formValidation = z.object({
    make: z.string().min(3, { message: "At least 3 characters in make" }),
    model: z.string().min(3, { message: "At least 3 characters in model" }),
    year: z.coerce.number().int().gte(1900).lte(new Date().getFullYear()), // ✅ coercing string to number
    price: z.coerce.number().positive({ message: "Price must be a number" }),
    mileage: z.coerce.number().positive({ message: "Price must be a number" }),
    description: z.string().min(5),
    color: z.string().min(3),
    fuel_type: z.string().min(2),
    transmission: z.string().min(2),
    image: z.string().min(3, { message: "At least 3 characters in image" }),
  });

  type FormSchema = z.infer<typeof formValidation>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formValidation) as any,
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

  // Submit form
  const onSubmit = (values: z.infer<typeof formValidation>) => {
    setFormError("");
    setMessage("");

    const accessToken = getAuthToken();
    if (!accessToken) {
      setFormError("❌ Access token missing!");
      return;
    }

    createCar({ newCar: values, accessToken });
  };

  // Watch result
  useEffect(() => {
    if (data) {
      setMessage("✅ Car created successfully!");
      form.reset();
      router.push("/");
    }
    if (isError) {
      const apiErr = error as any;
      setFormError(apiErr?.data?.message || "❌ Failed to create car");
    }
  }, [data, isError, error, form]);

  // Refresh token
  const refreshAccessToken = async () => {
    setRefreshing(true);
    setMessage("");
    setFormError("");
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token found.");

      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to refresh token");

      secureLocalStorage.setItem("authToken", data.token || data.access_token);
      if (data.refresh_token || data.refreshToken)
        secureLocalStorage.setItem(
          "refreshToken",
          data.refresh_token || data.refreshToken
        );

      setMessage("🔁 Token refreshed successfully!");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRefreshing(false);
    }
  };

  // Logout
  const logOutAccessToken = () => {
    logout();
    setMessage("🚪 You have been logged out.");
  };

  // Token checker
  const checkTokenStatus = () => {
    const access = getAuthToken();
    const refresh = getRefreshToken();
    alert(
      `Access Token: ${access ? "✅" : "❌"}\nRefresh Token: ${
        refresh ? "✅" : "❌"
      }`
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Create Car</h1>

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
          ].map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof CreateCarType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {name.replace("_", " ")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={
                        ["year", "price", "mileage"].includes(name)
                          ? "number"
                          : "text"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write a short description..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Car"}
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        <Button
          onClick={refreshAccessToken}
          variant="outline"
          className="w-full"
          disabled={refreshing}
        >
          🔁 {refreshing ? "Refreshing..." : "Refresh Access Token"}
        </Button>
        <Button
          onClick={checkTokenStatus}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          🔍 Check Token Status
        </Button>
        <Button
          onClick={logOutAccessToken}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          🚪 Logout
        </Button>
      </div>

      {formError && <p className="text-red-600">{formError}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {data && (
        <div className="bg-gray-50 p-4 rounded border text-sm whitespace-pre-wrap">
          <h3 className="font-semibold mb-1">✅ Created Car Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
