"use client";
import { useEffect, useState } from "react";
import { FiInfo, FiStar } from "react-icons/fi";
import { X } from "lucide-react"; // Make sure to import X
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";
import ContentViewer from "@/components/ContentViewer/ContentViewer";
import ContentViewerDetail from "@/components/ContentViewer/ContentViewDetail";
import { API_BASE_URL } from "@/apiServices/constants";
import {
  getProductViewHistory,
  removeProductFromViewHistory,
} from "@/utils/productViewHistoryUtils";
import { getProductsById } from "@/apiServices/products";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";
import ReviewSection from "./ReviewSection";

export default function DetailsSection({
  specifications,
  introductionContent,
  productId,
  posts,
  reviews,
}) {
  const [activeTab, setActiveTab] = useState("specs");
  const [viewedProduct, setViewedProduct] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const fetchProductViewHistory = async () => {
      const productViewHistory = getProductViewHistory();
      if (productViewHistory && productViewHistory.length > 0) {
        // Get most recently viewed product (which is at index 0)
        if (productViewHistory.length < 2) return;

        const lastViewedId = productViewHistory[1];

        try {
          const product = await getProductsById(lastViewedId);
          if (product) {
            setViewedProduct(product);
          }
        } catch (error) {
          console.error("Error fetching viewed product:", error);
        }
      }
    };
    fetchProductViewHistory();
  }, []);

  const handleDelete = (productId) => {
    if (!productId) return;

    setIsRemoving(true);

    // Remove after animation completes
    setTimeout(() => {
      removeProductFromViewHistory(productId);
      setViewedProduct(null);
    }, 300);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="mt-8 mb-12 flex max-lg:flex-col">
      {/* Main content - left side */}
      <div className="w-[70%] max-lg:w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Tab navigation */}
          <div className="flex mb-6 w-[50%] mx-auto max-lg:w-[90%]">
            <button
              onClick={() => setActiveTab("specs")}
              className={cn(
                "flex-1 py-4 text-center font-medium text-base max-lg:text-xs rounded-tl-lg rounded-bl-lg transition-all duration-200",
                activeTab === "specs"
                  ? "bg-blue-200 text-blue-700"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center justify-center">
                <FiInfo className="mr-2" />
                <span>Thông số kỹ thuật</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={cn(
                "flex-1 py-4 text-center font-medium text-base max-lg:text-xs rounded-tr-lg rounded-br-lg transition-all duration-200",
                activeTab === "reviews"
                  ? "bg-blue-200 text-blue-700"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center justify-center">
                <FiStar className="mr-2" />
                <span>Bài viết đánh giá</span>
              </div>
            </button>
          </div>

          {/* Tab content */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {activeTab === "specs" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
                <ContentViewerDetail content={specifications} />
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Bài viết đánh giá</h2>
                <ContentViewer content={introductionContent} />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6 ">
          <h2 className="text-xl font-bold text-gray-800 p-6">Bình luận</h2>
          <CommentSection productId={productId} />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6 p-6">
          <ReviewSection productId={productId} />
        </div>
      </div>
      {/* Sidebar - right side */}
      <div className="w-[30%] ml-6 max-lg:w-full max-lg:ml-0 max-lg:mt-6">
        <div className="sticky top-4">
          {viewedProduct ? (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">Sản phẩm đã xem</h2>
              <div
                className={`relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
                  isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
                } hover:shadow-md w-full`}
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDelete(viewedProduct._id)}
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full p-1 transition-colors backdrop-blur-sm"
                  aria-label="Remove product"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Product image and info */}
                <Link
                  href={`/san-pham/${viewedProduct.slug}`}
                  className="flex items-center p-3"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 mr-3">
                    <Image
                      src={`${API_BASE_URL}${viewedProduct.mainImage}`}
                      alt={viewedProduct.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="text-sm font-medium text-gray-800 line-clamp-2"
                      title={viewedProduct.name}
                    >
                      {viewedProduct.name}
                    </h4>

                    <div className="mt-2">
                      <span className="text-red-600 font-bold">
                        {formatPrice(
                          viewedProduct.price -
                            (viewedProduct.price *
                              (viewedProduct.discountPercent || 0)) /
                              100
                        )}
                        <span className="underline">đ</span>
                      </span>

                      {viewedProduct.discountPercent > 0 && (
                        <span className="text-xs text-gray-500 line-through block">
                          {formatPrice(viewedProduct.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ) : null}
          {posts && posts.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Cẩm nang</h2>
              <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )}
          {/* Reviews Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mt-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FiStar className="w-5 h-5 text-yellow-500" />
              Đánh giá sản phẩm
            </h2>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review._id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    {/* User info và Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {review.userId?.userName
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {review.userId?.userName || "Người dùng"}
                          </span>
                        </div>

                        {/* Rating stars */}
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <FiStar
                                key={i}
                                className="w-3 h-3 text-yellow-400 fill-current"
                              />
                            ))}
                            {Array.from(
                              { length: 5 - review.rating },
                              (_, i) => (
                                <FiStar
                                  key={i + review.rating}
                                  className="w-3 h-3 text-gray-300"
                                />
                              )
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(review.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {review.comment}
                    </p>
                  </div>
                ))}

                {/* Show more link nếu có nhiều reviews */}
                {reviews.length > 3 && (
                  <div className="pt-2 border-t border-gray-100">
                    <button className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors">
                      Xem thêm {reviews.length - 3} đánh giá khác
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <button
                  onClick={() => {
                    const reviewElement =
                      document.getElementById("reviewCreated");
                    if (reviewElement) {
                      reviewElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                  className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                >
                  <FiStar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">
                    Chưa có đánh giá nào
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Hãy là người đầu tiên đánh giá sản phẩm này
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
