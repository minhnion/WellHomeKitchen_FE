import { Suspense } from "react";
import UpdatePostForm from "./UpdatePostForm/UpdatePostForm";

export default function UpdatePostPage() {
  return (
    <Suspense>
      <UpdatePostForm />
    </Suspense>
  );
}