import { useState } from "react";
import { Avatar } from "../Avatar/Avatar";

export const CommentItem = ({
  comment,
  onDelete,
  onReply,
  replyToCommentId,
  newComment,
  setNewComment,
  onSubmitReply,
  onCancelReply,
  userData,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const isReplying = replyToCommentId === comment._id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isReplyComment = !!comment.parentComment; // This is already a reply

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-start gap-3">
        <Avatar name={comment.name} size="w-8 h-8" />
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl px-3 py-2">
            <p className="font-medium text-sm text-gray-900">
              {comment.name || "Ẩn danh"}
            </p>
            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{new Date(comment.createdAt).toLocaleString("vi-VN")}</span>

            {/* Only show reply button for parent comments */}
            {!isReplyComment && (
              <button
                onClick={() => onReply(comment._id)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Phản hồi
              </button>
            )}

            <button
              onClick={() => onDelete(comment._id)}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Xóa
            </button>
          </div>

          {/* Reply Form - Only for parent comments */}
          {isReplying && !isReplyComment && (
            <div className="mt-3">
              <form onSubmit={onSubmitReply} className="flex items-start gap-2">
                <Avatar name={userData?.userName || "Admin"} size="w-6 h-6" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết phản hồi..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 transition-colors"
                    >
                      Gửi
                    </button>
                    <button
                      type="button"
                      onClick={onCancelReply}
                      className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full hover:bg-gray-300 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Show/Hide Replies Toggle - Only for parent comments with replies */}
          {hasReplies && !isReplyComment && (
            <div className="mt-3">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-xs font-medium"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showReplies ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {showReplies ? "Ẩn" : "Xem"} {comment.replies.length} câu trả
                lời
              </button>
            </div>
          )}

          {/* Replies List - Only show when expanded */}
          {showReplies && hasReplies && !isReplyComment && (
            <div className="mt-3 ml-3 space-y-2 border-l-2 border-gray-100 pl-3">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <Avatar name={reply.name} size="w-6 h-6" />
                    <div className="flex-1 min-w-0">
                      <div className="bg-white rounded-xl px-3 py-2">
                        <p className="font-medium text-xs text-gray-900">
                          {reply.name || "Ẩn danh"}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          {reply.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          {new Date(reply.createdAt).toLocaleString("vi-VN")}
                        </span>
                        <button
                          onClick={() => onDelete(reply._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
