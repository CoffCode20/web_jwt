"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisableCustomerMutation } from "@/redux/service/customer/customer";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomModal } from "../ui/custom-modal";
import { CustomerCreateForm } from "./crud_form/CreateCustomerComponent";
import { CustomerEditForm } from "./crud_form/UpdateCustomerComponent";

export interface Customer {
  id?: string;
  fullName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  remark?: string;
  nationalCardId: string;
  customerSegment: string;
  isActive?: boolean;
}

interface Props {
  customer: Customer;
}

export function CustomerActions({ customer }: Props) {
  const [openForm, setOpenForm] = useState<
    "create" | "edit" | "disable" | null
  >(null);

  const [disableCustomer, { isLoading }] = useDisableCustomerMutation();

  async function handleDisable() {
    try {
      await disableCustomer(customer.phone).unwrap();
      toast.success("Customer disabled successfully"); // optional toast
      setOpenForm(null);
    } catch (error) {
      toast.error("Failed to disable customer");
      console.error(error);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenForm("create")}>
            Create
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenForm("edit")}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenForm("disable")}>
            Disable
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openForm === "create" && (
        <CustomModal title="Create Customer">
          <CustomerCreateForm onClose={() => setOpenForm(null)} />
        </CustomModal>
      )}

      {openForm === "edit" && (
        <CustomModal title="Edit Customer">
          <CustomerEditForm
            initialData={customer}
            onClose={() => setOpenForm(null)}
          />
        </CustomModal>
      )}

      {openForm === "disable" && (
        <CustomModal title="Disable Customer">
          <div className="space-y-4">
            <p>
              Are you sure you want to disable customer{" "}
              <strong>{customer.fullName}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOpenForm(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisable}
                disabled={isLoading}
              >
                {isLoading ? "Disabling..." : "Confirm"}
              </Button>
            </div>
          </div>
        </CustomModal>
      )}
    </>
  );
}
