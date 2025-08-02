"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Customer,
  useUpdateCustomerMutation,
} from "@/redux/service/customer/customer";

import { z } from "zod";

interface CustomerEditFormProps {
  initialData: Customer;
  onClose: () => void;
}

const customerUpdateSchema = z.object({
  fullName: z.string().optional(),
  gender: z.string().optional(),
  remark: z.string().optional(),
});

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>;

export function CustomerEditForm({
  initialData,
  onClose,
}: CustomerEditFormProps) {
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerUpdateFormValues>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: {
      fullName: initialData.fullName,
      gender: initialData.gender,
      remark: initialData.remark ?? "",
    },
  });

  const onSubmit = async (data: CustomerUpdateFormValues) => {
    await updateCustomer({
      phoneNumber: initialData.phone,
      updates: data,
    });
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
        <Input placeholder="Remark (optional)" {...register("remark")} />
        <p className="text-red-500 text-sm">{errors.remark?.message}</p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Customer"}
      </Button>
    </form>
  );
}
