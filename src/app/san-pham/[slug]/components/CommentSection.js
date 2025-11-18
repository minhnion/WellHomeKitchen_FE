"use client";
import { useState, useEffect } from "react";
import { getCommentsByProduct } from "@/apiServices/comment";
import { User, Reply, X } from "lucide-react";
import CommentForm from "./CommentForm";

export default function CommentSection({ productId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReply, setIsReply] = useState(false);
  const [isShowReply, setIsShowReply] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getCommentsByProduct(productId);
        setComments(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  if (isLoading)
    return (
      <div className="py-6 text-center text-gray-500">
        Đang tải bình luận...
      </div>
    );

  return (
    <div className="bg-white rounded-xl p-6 mb-4">
      {/* comment list */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <p>Không có bình luận nào.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <div
              key={comment?._id}
              className="flex items-start gap-2 border-b border-gray-200 pb-2"
            >
              <div className="flex-shrink-0">
                <User className="w-9 h-9 text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-gray-900">{comment?.name}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(comment?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment?.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    type="button"
                    className="flex items-center text-blue-500 hover:underline text-sm font-medium"
                    onClick={() => setIsReply(true)}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Trả lời
                  </button>
                  {comment &&
                    comment.replies &&
                    comment?.replies.length > 0 && (
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        onClick={() => setIsShowReply((prev) => !prev)}
                      >
                        {isShowReply ? "Ẩn" : "Xem"} {comment?.replies.length}{" "}
                        câu trả lời
                      </button>
                    )}
                </div>
                {isReply && (
                  <div className="mt-4 p-4 bg-gray-50 rounded relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => setIsReply(false)}
                    >
                      <X className="w-5 h-5 text-red-500 cursor-pointer" />
                    </button>
                    <CommentForm
                      productId={productId}
                      parentComment={comment?._id}
                      setComments={setComments}
                      setIsReply={setIsReply}
                    />
                  </div>
                )}
                {comment &&
                  comment.replies &&
                  comment?.replies.length > 0 &&
                  isShowReply && (
                    <div className="ml-8 mt-2 space-y-4">
                      {comment?.replies &&
                        comment?.replies.map((reply) => (
                          <div
                            key={reply._id}
                            className="flex items-start gap-2"
                          >
                            <User className="w-7 h-7 text-gray-300" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-medium text-gray-800">
                                  {reply.name}
                                </h3>
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-600">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* comment form */}
      <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-4 border-t border-gray-100 pt-6">
        Để lại bình luận
      </h2>
      <CommentForm productId={productId} setComments={setComments} />
    </div>
  );
}
