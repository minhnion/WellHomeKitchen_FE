"use client";
import { API_BASE_URL } from "@/apiServices/constants";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const GalleryImage = ({ formFields, onChangeFormFields, onOpenImageModal }) => {
  const galleryImages = formFields.galleryImages || [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      id: uuidv4(),
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: formatFileSize(file.size),
    }));
    onChangeFormFields({
      ...formFields,
      galleryImages: [...galleryImages, ...newImages],
    });
  };

  const getImageSrc = (image) => {
    if (image.preview) return image.preview;
    if (image.url) {
      try {
        return new URL(image.url, API_BASE_URL).href;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const removeImage = (id) => {
    const updatedImages = galleryImages.filter((img) => img.id !== id);
    onChangeFormFields({ ...formFields, galleryImages: updatedImages });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Hình ảnh mô tả chi tiết
      </h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px]">
        {galleryImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 space-y-2">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-center text-gray-500 hover:text-blue-600"
            >
              Thả file hoặc nhấn để chọn từ máy tính
            </label>
            <button
              type="button"
              onClick={onOpenImageModal}
              className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
            >
              Hoặc chọn từ hệ thống
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <div key={image.name} className="bg-gray-50 rounded-lg p-3">
                  <div className="aspect-square bg-white rounded border mb-2 overflow-hidden">
                    <img
                      src={getImageSrc(image)}
                      alt={image.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div
                    className="text-xs text-gray-600 mb-1 truncate"
                    title={image.name}
                  >
                    {image.name}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{image.size}</div>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="text-xs text-gray-500 hover:text-red-500 transition-colors w-full text-center"
                  >
                    Xóa ảnh
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-4 border-t border-gray-200 space-x-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="add-more-images"
              />
              <label
                htmlFor="add-more-images"
                className="cursor-pointer text-blue-500 text-sm hover:text-blue-600"
              >
                + Thêm từ máy tính
              </label>
              <button
                type="button"
                onClick={onOpenImageModal}
                className="text-blue-500 text-sm hover:text-blue-600"
              >
                + Thêm từ hệ thống
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryImage;
