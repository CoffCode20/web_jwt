"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { getAuthToken, getRefreshToken, logout } from "@/lib/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// 1. Zod Schema
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

type CarFormValues = z.infer<typeof carFormSchema>;

export default function CreateCarFormWithAuth() {
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema) as any,
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [carData, setCarData] = useState<CarFormValues | null>(null);

  // Submit car data with token
  async function onSubmit(values: CarFormValues) {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Access token missing!");

      const res = await fetch("https://car-nextjs-api.cheatdev.online/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Access token expired. Please refresh your token.");
        }
        throw new Error(result.message || "Failed to create car");
      }

      setMessage("✅ Car created successfully!");
      setCarData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Refresh token
  const refreshAccessToken = async () => {
    setRefreshing(true);
    setError("");
    setMessage("");

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
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRefreshing(false);
    }
  };

  // Logout
  const logOutAccessToken = () => {
    logout();
    setMessage("You have been logged out.");
    setCarData(null);
  };

  // Token check
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
      <h1 className="text-2xl font-bold text-center">
        🚗 Create Car (Zod Form)
      </h1>

      {/* Form */}
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
              name={name as keyof CarFormValues}
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
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Car"}
          </Button>
        </form>
      </Form>

      {/* Button Actions */}
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

      {/* Result Display */}
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      {carData && (
        <div className="bg-gray-50 p-4 rounded border text-sm whitespace-pre-wrap">
          <h3 className="font-semibold mb-1">✅ Created Car Data:</h3>
          <pre>{JSON.stringify(carData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
