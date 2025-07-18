"use client";

import { Switch } from "@/components/ui/switch";
import { getAuthToken, getRefreshToken, logout } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const updateCarSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().gte(1886).lte(new Date().getFullYear()),
  price: z.coerce.number().positive(),
  mileage: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  color: z.string().min(1),
  fuel_type: z.string().min(1),
  transmission: z.string().min(1),
  image: z.string().url({ message: "Must be a valid image URL" }),
  is_sold: z.boolean(),
});

export default function UpdateCarFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to update a car");
    }
  }, []);

  const form = useForm<z.infer<typeof updateCarSchema>>({
    resolver: zodResolver(updateCarSchema) as any,
    defaultValues: {
      id: "",
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
      if (data.refresh_token || data.refreshToken) {
        secureLocalStorage.setItem(
          "refreshToken",
          data.refresh_token || data.refreshToken
        );
      }

      setMessage("🔁 Token refreshed successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRefreshing(false);
    }
  };

  const checkTokenStatus = () => {
    const access = getAuthToken();
    const refresh = getRefreshToken();
    alert(
      `Access Token: ${access ? "✅" : "❌"}\nRefresh Token: ${
        refresh ? "✅" : "❌"
      }`
    );
  };

  const logOutAccessToken = () => {
    logout();
    setMessage("You have been logged out.");
  };

  async function onSubmit(values: z.infer<typeof updateCarSchema>) {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage("Please login first");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/crud/update-car", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update car");
      }

      setMessage("✅ Car updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  const fields = [
    "id",
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
    <div className="max-w-2xl mx-auto space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
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
                        placeholder={`Enter ${fieldName}`}
                      />
                    </FormControl>
                    <FormMessage />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_sold"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormLabel>Sold</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? "Updating..." : "Update Car"}
          </Button>
        </form>
      </Form>

      {/* Token Management Buttons */}
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
    </div>
  );
}
