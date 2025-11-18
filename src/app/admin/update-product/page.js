import { Suspense } from "react";
import UpdateProductForm from "./UpdateProductForm/UpdataProductForm";

export default function UpdateProductPage() {
  return (
    <Suspense>
      <UpdateProductForm />
    </Suspense>
  );
}
