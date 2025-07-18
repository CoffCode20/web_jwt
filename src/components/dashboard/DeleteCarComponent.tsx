"use client";

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

// Zod Schema
const deleteCarSchema = z.object({
  id: z.string().min(1, { message: "Car ID is required" }),
});

export default function DeleteCarFormComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token);
    if (!token) {
      setMessage("Please login first to delete a car.");
    }
  }, []);

  const form = useForm<z.infer<typeof deleteCarSchema>>({
    resolver: zodResolver(deleteCarSchema),
    defaultValues: {
      id: "",
    },
  });

  // Delete request
  async function onSubmit(values: z.infer<typeof deleteCarSchema>) {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage("Please login first.");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/crud/delete-car", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        let errorMessage = data.message || "Failed to delete car";
        if (res.status === 403) {
          errorMessage = "Lub Car bos yg create.";
        } else if (res.status === 404) {
          errorMessage = "Car not found or already deleted.";
        } else if (res.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        }

        setError(errorMessage);
        return;
      }

      setMessage("✅ Car deleted successfully!");
      form.reset();
    } catch (err) {
      setError("An error occurred while deleting the car.");
    } finally {
      setIsLoading(false);
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
    form.reset();
  };

  // Token status
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
    <div className="max-w-2xl mx-auto space-y-4">
      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800 mb-2">
            You need to login to delete a car.
          </p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </a>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6 bg-white rounded-lg shadow-md"
        >
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter car ID"
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white w-full"
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? "Deleting..." : "Delete Car"}
          </Button>
        </form>
      </Form>

      {/* Token Tools */}
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
