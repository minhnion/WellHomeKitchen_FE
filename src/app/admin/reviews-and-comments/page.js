import { Suspense } from "react";
import ReviewsCommentsData from "./ReviewsCommentsData/ReviewsCommentsData";

export default function ReviewsAndCommentsPage() {
  return (
    <Suspense>
      <ReviewsCommentsData />
    </Suspense>
  );
}
