"use client";
import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { Plus, Minus } from "lucide-react";
import ContentViewer from "@/components/ContentViewer/ContentViewer";
import ContentViewerDetail from "@/components/ContentViewer/ContentViewDetail";
import ProductCard from "@/components/ProductCard/ProductCard";
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

  const [viewedProducts, setViewedProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProductViewHistory = async () => {
      const history = getProductViewHistory();
      if (!history || history.length <= 1) return;

      const ids = history.slice(0, 5);

      try {
        const products = await Promise.all(
          ids.map((id) => getProductsById(id))
        );

        setViewedProducts(products.filter(Boolean));
      } catch (error) {
        console.error("Error fetching viewed products:", error);
      }
    };

    fetchProductViewHistory();
  }, []);



  // Hàm parse specifications thành mảng key-value
  const parseSpecifications = (specs) => {
    if (!specs) return [];

    try {
      // Nếu specs là string HTML, tạm bỏ qua
      if (typeof specs === 'string' && specs.includes('<')) {
        return [];
      }

      // Nếu specs là object
      if (typeof specs === 'object' && !Array.isArray(specs)) {
        return Object.entries(specs).map(([key, value]) => ({
          key: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: value
        }));
      }

      return [];
    } catch (error) {
      console.error("Error parsing specifications:", error);
      return [];
    }
  };

  const parsedSpecs = parseSpecifications(specifications);

  return (
    <div className="mt-8 mb-12 space-y-6">
      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* CONTENT WRAPPER */}
          <div
            className={`relative transition-all duration-500 overflow-hidden ${isExpanded ? "max-h-[5000px]" : "max-h-[220px]"
              }`}
          >
            <div className="text-black font-bold">MÔ TẢ SẢN PHẨM</div>
            <div className="w-full h-px bg-gray-200 my-4" />

            {/* BÀI VIẾT ĐÁNH GIÁ */}
            <div className="mb-8">
              <h2 className="text-2xl text-blue-800 font-bold mb-4 flex items-center gap-2">
                Bài viết đánh giá
              </h2>
              <ContentViewer content={introductionContent} />
            </div>

            {/* THÔNG SỐ KỸ THUẬT  */}
            <div>
              <h2 className="text-2xl text-blue-800 font-bold mb-4 flex items-center gap-2">
                Thông số kỹ thuật
              </h2>

              {parsedSpecs.length > 0 ? (
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {parsedSpecs.map((spec, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 w-1/3">
                            {spec.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Fallback nếu không parse được
                <ContentViewerDetail content={specifications} />
              )}
            </div>

            {/* FADE BOTTOM KHI THU GỌN */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>

          {/* BUTTON TOGGLE */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium
             text-blue-800 border border-blue-800 "
            >
              {isExpanded ? (
                <>
                  <Minus className="w-4 h-4" />
                  Thu gọn nội dung
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Xem thêm nội dung
                </>
              )}
            </button>
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

      <div className="w-full">
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
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm my-6">
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

        {/* sản phẩm đã xem */}
        {viewedProducts.length > 0 && (
          <>
            <h2 className="text-xl text-blue-800 font-bold mb-4 pl-1">
              Sản phẩm đã xem
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {viewedProducts
                .filter(Boolean)
                .map((product) => (
                  <ProductCard key={product._id} {...product} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}