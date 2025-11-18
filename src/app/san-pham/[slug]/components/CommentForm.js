"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createComment } from "@/apiServices/comment";
import { User } from "lucide-react";
import { getAnonymousId } from "@/utils/anonymousUtils";

export default function CommentForm({ parentComment, productId, setComments }) {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const idAnonymous = getAnonymousId();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const created = await createComment({
      ...data,
      product: productId,
      idAnonymous,
      parentComment,
    });
    if (created && !parentComment) {
      setComments((prev) => [
        ...prev,
        {
          ...created,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
      localStorage.setItem("name", name);
    }
    if (created && parentComment) {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment._id === parentComment) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  ...created,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            };
          }
          return comment;
        })
      );
    }
    reset();
    setContent("");
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-2 flex flex-col gap-3 max-w-xl mx-1"
    >
      <div className="flex items-start gap-3">
        <span className="bg-gray-100 rounded-full p-2">
          <User className="w-6 h-6 text-gray-400" />
        </span>
        <div className="flex-1 flex flex-col gap-2">
          <input
            {...register("name", { required: true })}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bạn"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.name && (
            <span className="text-sm text-red-500 mt-1 block">
              Vui lòng nhập tên
            </span>
          )}
          <input
            {...register("content", { required: true })}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn có thắc mắc gì không, hãy để lại câu hỏi ở đây nhé !"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          {errors.content && (
            <span className="text-sm text-red-500 mt-1 block">
              Vui lòng nhập bình luận
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          Gửi
        </button>
      </div>
    </form>
  );
}
