"use client";


import { CustomerCreateForm } from "@/components/customer/crud_form/CreateCustomerComponent";
import { CustomModal } from "@/components/ui/custom-modal";
import { useRouter } from "next/navigation";

export default function CreateCustomerModalPage() {
  const router = useRouter();

  function closeModal() {
    router.back(); // Go back to list page
  }

  return (
    <CustomModal title="Create Customer">
      <CustomerCreateForm onClose={closeModal} />
    </CustomModal>
  );
}
