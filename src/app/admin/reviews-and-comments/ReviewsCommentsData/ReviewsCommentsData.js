"use client";

import {
  getCommentsByProduct,
  createComment,
  deleteComment,
} from "@/apiServices/comment";
import {
  getReviewsByProduct,
  deleteReview,
  getReviewStats,
} from "@/apiServices/review";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CommentItem } from "./CommentItem/CommentItem";
import { StarRating } from "./StarRating/StarRating";
import { Avatar } from "./Avatar/Avatar";
import { getAnonymousId } from "@/utils/anonymousUtils";
import { getProductsById } from "@/apiServices/products";

export default function ReviewsCommentsData({}) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [productDetails, setProductDetails] = useState(null);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [limit] = useState(5);
  const [rating, setRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [anonymousId, setAnonymousId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: "",
  });
  const ratingOptions = [1, 2, 3, 4, 5];
  const [reviewPagination, setReviewPagination] = useState({
    totalPages: 1,
    totalReviews: 0,
  });
  const [commentPagination, setCommentPagination] = useState({
    totalPages: 1,
    totalComments: 0,
  });

  // Get user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    const anonymousIdResponse = getAnonymousId();
    setAnonymousId(anonymousIdResponse);
  }, []);

  // Fetch product details
  const fetchProductDetails = async () => {
    if (!productId) return;
    try {
      const productData = await getProductsById(productId);
      if (productData) {
        setProductDetails(productData);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    if (!productId) {
      toast.error("Không tìm thấy sản phẩm");
      return;
    }
    try {
      const response = await getReviewsByProduct(
        productId,
        currentReviewPage,
        limit,
        rating
      );
      if (response) {
        setReviews(response.data || []);
        setReviewPagination({
          totalPages: response.pagination?.totalPages || 1,
          totalReviews:
            response.pagination?.totalReviews || response.count || 0,
        });
      } else {
        setReviews([]);
        setReviewPagination({ totalPages: 1, totalReviews: 0 });
      }
    } catch (error) {
      toast.error("Lỗi tải đánh giá");
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    if (!productId) {
      toast.error("Không tìm thấy sản phẩm");
      return;
    }
    try {
      const response = await getCommentsByProduct(
        productId,
        currentCommentPage,
        limit
      );
      if (response) {
        setComments(response.data || []);
        setCommentPagination({
          totalPages: response.pagination?.totalPages || 1,
          totalComments: response.pagination?.totalComments || 0,
        });
      } else {
        setComments([]);
        setCommentPagination({ totalPages: 1, totalComments: 0 });
      }
    } catch (error) {
      toast.error("Lỗi tải bình luận");
      console.error("Error fetching comments:", error);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    setDeleteModal({
      isOpen: true,
      type: "review",
      id: reviewId,
      title: "Bạn có chắc muốn xóa đánh giá này?",
    });
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    setDeleteModal({
      isOpen: true,
      type: "comment",
      id: commentId,
      title: "Bạn có chắc muốn xóa bình luận này?",
    });
  };

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      if (deleteModal.type === "review") {
        const success = await deleteReview(deleteModal.id);
        if (success) {
          toast.success("Xóa đánh giá thành công");
          fetchReviews();
        }
      } else if (deleteModal.type === "comment") {
        const success = await deleteComment(deleteModal.id);
        if (success) {
          toast.success("Xóa bình luận thành công");
          fetchComments();
        }
      }
    } catch (error) {
      toast.error(
        `Lỗi xóa ${deleteModal.type === "review" ? "đánh giá" : "bình luận"}`
      );
      console.error(`Error deleting ${deleteModal.type}:`, error);
    } finally {
      setDeleteModal({
        isOpen: false,
        type: null,
        id: null,
        title: "",
      });
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      type: null,
      id: null,
      title: "",
    });
  };

  // Create comment (admin reply)
  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }
    try {
      const commentData = {
        product: productId,
        content: newComment,
        parentComment: replyToCommentId,
        name: userData?.userName || "Admin",
        idAnonymous: anonymousId,
      };
      const createdComment = await createComment(commentData);
      if (createdComment.success) {
        toast.success(createdComment.message || "Tạo bình luận thành công");
        setNewComment("");
        setReplyToCommentId(null);
        fetchComments();
      } else {
        toast.error(createdComment.message || "Lỗi tạo bình luận");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi tạo bình luận");
      }
      console.error("Error creating comment:", error);
    }
  };

  // Start replying to a comment
  const startReply = (commentId) => {
    setReplyToCommentId(commentId);
    setNewComment("");
  };

  const cancelReply = () => {
    setReplyToCommentId(null);
    setNewComment("");
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [productId, currentReviewPage, rating]);

  useEffect(() => {
    fetchComments();
  }, [productId, currentCommentPage]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setCurrentReviewPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Product Title Header */}
        {productDetails && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 flex-1">
                Đánh giá và bình luận sản phẩm "{productDetails.name}"
              </h1>
              <a
                href={`/san-pham/${productDetails.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                title="Xem sản phẩm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="text-sm font-medium">Xem sản phẩm</span>
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reviews Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Đánh giá sản phẩm
              </h2>
              <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {reviewPagination.totalReviews} đánh giá
              </span>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Lọc theo đánh giá:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleRatingChange(null)}
                  className={`px-3 py-2 text-xs font-medium rounded-full transition-colors ${
                    rating === null
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                {ratingOptions.map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-full transition-colors ${
                      rating === star
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{star}</span>
                    <span className="text-yellow-400">★</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 mb-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={review.userId?.userName} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-sm text-gray-900">
                            {review.userId?.userName || "Ẩn danh"}
                          </p>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {review.comment}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleString("vi-VN")}
                          </span>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Chưa có đánh giá nào</p>
                </div>
              )}
            </div>

            <AdminPagination
              currentPage={currentReviewPage}
              totalPages={reviewPagination.totalPages}
              totalRecords={reviewPagination.totalReviews}
              itemsPerPage={limit}
              setCurrentPage={setCurrentReviewPage}
            />
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Bình luận</h2>
              <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {commentPagination.totalComments} bình luận
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-1 mb-6 max-h-96 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                    onReply={startReply}
                    replyToCommentId={replyToCommentId}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onSubmitReply={handleCreateComment}
                    onCancelReply={cancelReply}
                    userData={userData}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Chưa có bình luận nào</p>
                </div>
              )}
            </div>

            <AdminPagination
              currentPage={currentCommentPage}
              totalPages={commentPagination.totalPages}
              totalRecords={commentPagination.totalComments}
              itemsPerPage={limit}
              setCurrentPage={setCurrentCommentPage}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title={deleteModal.title}
          deleteButton={
            deleteModal.type === "review" ? "Xóa đánh giá" : "Xóa bình luận"
          }
        />
      </div>
    </div>
  );
}
