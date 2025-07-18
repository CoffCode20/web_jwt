"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginResponse, SignupData } from "@/lib/types";

// Zod schema
const signupSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmed_password: z
      .string()
      .min(6, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: "Passwords do not match",
    path: ["confirmed_password"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const signupUser = async (signupData: SignupData): Promise<LoginResponse> => {
  if (signupData.password !== signupData.confirmed_password) {
    throw new Error("Passwords do not match");
  }

  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  const possibleTokenFields = [
    "token",
    "access_token",
    "accessToken",
    "authToken",
  ];
  const actualTokenField = possibleTokenFields.find((field) => data[field]);

  if (actualTokenField && data[actualTokenField]) {
    secureLocalStorage.setItem("authToken", data[actualTokenField]);
  }

  secureLocalStorage.setItem("user", JSON.stringify(data.user || null));

  const refreshToken = data.refreshToken || data.refresh_token;
  if (refreshToken) {
    secureLocalStorage.setItem("refreshToken", refreshToken);
  }

  return data;
};

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmed_password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setServerError("");

    try {
      await signupUser(data);
      router.push("/login");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Signup failed");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
          <div>
            <Input
              type="text"
              placeholder="Username"
              disabled={loading}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              disabled={loading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              disabled={loading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              disabled={loading}
              {...register("confirmed_password")}
            />
            {errors.confirmed_password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmed_password.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <p className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </form>

        {serverError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}
      </div>
    </div>
  );
}
