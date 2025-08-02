"use client";

import { useRouter, useParams } from "next/navigation";
import { CustomModal } from "@/components/ui/custom-modal";
import { CustomerEditForm } from "@/components/customer/crud_form/UpdateCustomerComponent";
import { useGetCustomerByPhoneQuery } from "@/redux/service/customer/customer";

export default function EditCustomerModalPage() {
  const router = useRouter();
  const params = useParams();
  const phone =
    typeof params.phone === "string" ? params.phone : params.phone?.[0] ?? "";

  const { data, isLoading, isError } = useGetCustomerByPhoneQuery(phone);

  const closeModal = () => router.back();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data?.data) return <p>Customer not found</p>;

  return (
    <CustomModal title="Edit Customer">
      <CustomerEditForm initialData={data.data} onClose={closeModal} />
    </CustomModal>
  );
}
