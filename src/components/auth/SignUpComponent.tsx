"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// form schema validation with zod

// formSchema Validation using zod
const formValidation = z
  .object({
    username: z.string().min(2, {
      message: "At least input 2 character in username",
    }),

    email: z.email({ pattern: z.regexes.rfc5322Email }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 character up" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),

    confirmed_password: z
      .string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: "Password and Confirm Password didn't match",
  });

function RegisterComponent() {
  // 1. define form
  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmed_password: "",
    },
  });

  // 2. apply handle submission
  async function handleSubmit(values: z.infer<typeof formValidation>) {}

  return (
    <div className="w-[500] mx-auto h-full items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    aria-describedby="username-error"
                  />
                </FormControl>
                <FormMessage id="username-error" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    aria-describedby="email-error"
                  />
                </FormControl>
                <FormMessage id="email-error" />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password. Ex: Koko123$$"
                    {...field}
                    aria-describedby="password-error"
                  />
                </FormControl>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmed_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                    aria-describedby="confirmed-password-error"
                  />
                </FormControl>
                <FormMessage id="confirmed-password-error" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RegisterComponent;
