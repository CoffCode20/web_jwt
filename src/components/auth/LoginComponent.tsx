"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// formSchema Validation using zod
const formValidation = z.object({
  email: z.email({ pattern: z.regexes.rfc5322Email }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 character up",
    })
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
});

export default function LoginFormComponent() {
  // 1. Define form
  const form = useForm<z.infer<typeof formValidation>>({
    resolver: zodResolver(formValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. apply handlesubmission
  async function onSubmit(values: z.infer<typeof formValidation>) {
    // implement register function server handleroute
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/form",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        console.log("Failed to register");
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-[400px] border p-8 rounded-lg mx-auto ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="koko@gmail.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Koko123$%$%" {...field} type="password" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
