"use client";

import React, { useEffect, useState } from "react";
import { Star, Send, MessageCircle } from "lucide-react";
import { createReview } from "@/apiServices/review";
import { toast, ToastContainer } from "react-toastify";
import { isTokenExpired } from "@/utils/authenticate";

const ReviewSection = ({ productId }) => {
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // get token from localStorage
    const token = localStorage.getItem("accessToken");
    if (isTokenExpired(token)) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmitting(true);

      await createReview({
        productId,
        rating,
        comment: comment.trim(),
      });

      toast.success("Đánh giá của bạn đã được gửi thành công!");

      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment("");
    } catch (error) {
      console.error("Error creating review:", error);

      if (error.response?.status === 409) {
        toast.error("Bạn đã đánh giá sản phẩm này rồi");
      } else {
        toast.error("Có lỗi xảy ra khi gửi đánh giá");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({
    value,
    onRatingChange,
    interactive = false,
    size = "w-6 h-6",
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } 
                       transition-transform duration-200 ${
                         !interactive && "pointer-events-none"
                       }`}
          >
            <Star
              className={`${size} transition-colors duration-200 ${
                star <= (interactive ? hoveredRating || value : value)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center" id="reviewCreated">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h4 className="font-medium text-gray-600 mb-1">
          Đăng nhập để đánh giá
        </h4>
        <p className="text-sm text-gray-500">
          Hãy đăng nhập để chia sẻ đánh giá về sản phẩm này
        </p>
      </div>
    );
  }

  return (
    <div className="p-3" id="reviewCreated">
      <ToastContainer />
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        Đánh giá sản phẩm
      </h3>

      {/* Review Form */}
      <form onSubmit={handleSubmitReview} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá sao <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <StarRating
              value={rating}
              onRatingChange={setRating}
              interactive={true}
              size="w-8 h-8"
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600 font-medium">
                {rating}/5 sao
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung đánh giá <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-500">
              {comment.trim().length < 10 && comment.trim().length > 0 && (
                <span className="text-red-500">
                  Cần ít nhất 10 ký tự ({10 - comment.trim().length} ký tự nữa)
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {comment.length}/500 ký tự
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0 || comment.trim().length < 10}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Gửi đánh giá
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
