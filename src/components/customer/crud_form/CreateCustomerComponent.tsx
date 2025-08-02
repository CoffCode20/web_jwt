"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
// src/lib/customer/customer.schema.ts
import { z } from "zod";
import { useCreateCustomerMutation } from "@/redux/service/customer/customer";
import { Button } from "@/components/ui/button";

const customerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone number too short"),
  nationalCardId: z.string().min(5),
  customerSegment: z.string().min(1),
  remark: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerCreateFormProps {
  onClose: () => void;
}

export function CustomerCreateForm({ onClose }: CustomerCreateFormProps) {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormValues) => {
    await createCustomer(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 max-w-md">
      <div>
        <Input placeholder="Full Name" {...register("fullName")} />
        <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
      </div>
      <div>
        <Input
          placeholder="Gender (Male/Female/Other)"
          {...register("gender")}
        />
        <p className="text-red-500 text-sm">{errors.gender?.message}</p>
      </div>
      <div>
        <Input type="date" {...register("dob")} />
        <p className="text-red-500 text-sm">{errors.dob?.message}</p>
      </div>
      <div>
        <Input placeholder="Email" {...register("email")} />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>
      <div>
        <Input placeholder="Phone" {...register("phone")} />
        <p className="text-red-500 text-sm">{errors.phone?.message}</p>
      </div>
      <div>
        <Input placeholder="National Card ID" {...register("nationalCardId")} />
        <p className="text-red-500 text-sm">{errors.nationalCardId?.message}</p>
      </div>
      <div>
        <Input
          placeholder="Customer Segment"
          {...register("customerSegment")}
        />
        <p className="text-red-500 text-sm">
          {errors.customerSegment?.message}
        </p>
      </div>
      <div>
        <Input placeholder="Remark (optional)" {...register("remark")} />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Customer"}
      </Button>
    </form>
  );
}
