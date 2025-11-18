"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";

const PostInfo = ({ formFields, onChangeFormFields, onOpenImageModal }) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!formFields.coverImage) {
      setPreviewUrl("");
      return;
    }

    if (typeof formFields.coverImage === "string") {
      try {
        setPreviewUrl(new URL(formFields.coverImage, API_BASE_URL).href);
      } catch (error) {
        console.error("Invalid URL for coverImage:", error);
        setPreviewUrl("");
      }
      return;
    }

    if (
      formFields.coverImage instanceof File ||
      formFields.coverImage instanceof Blob
    ) {
      const objectUrl = URL.createObjectURL(formFields.coverImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl("");
  }, [formFields.coverImage]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onChangeFormFields({ ...formFields, coverImage: file });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("author.")) {
      const field = name.split(".")[1];
      onChangeFormFields({
        ...formFields,
        author: { ...formFields.author, [field]: value },
      });
    } else {
      onChangeFormFields({ ...formFields, [name]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Thông tin bài viết
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề bài viết (*)
            </label>
            <input
              type="text"
              name="title"
              value={formFields.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Tiêu đề"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tác giả
            </label>
            <input
              type="text"
              name="author.name"
              value={formFields.author.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Tác giả"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tóm tắt
            </label>
            <textarea
              name="excerpt"
              value={formFields.excerpt}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              placeholder="Mô tả ngắn gọn sản phẩm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh chính (*)
            </label>
            <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">Chọn ảnh</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <button
              type="button"
              onClick={onOpenImageModal}
              className="w-full text-sm py-1.5 px-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Chọn từ hệ thống
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostInfo;
