"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

import { getPostBySlug, updatePost } from "@/apiServices/posts";
import { uploadImage } from "@/apiServices/upload";
import { base64ToFile } from "@/utils/base64ToFile";
import { API_BASE_URL } from "@/apiServices/constants";

import PostInfo from "@/components/CreateAndUpdatePost/PostInfo";
import TagsAndStatus from "@/components/CreateAndUpdatePost/TagsAndStatus";
import CategorySelect from "@/components/CreateAndUpdatePost/CategorySelect";
import FileSelectModal from "@/components/FileSelectModal/FileSelectModal";

const ContentEditor = dynamic(
  () => import("@/components/CreateAndUpdatePost/ContentEditor"),
  { ssr: false }
);

export default function UpdatePostForm() {
  const searchParams = useSearchParams();
  const [formFields, setFormFields] = useState(null);
  const editorRef = useRef(null);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);

  const handleOpenImageModal = useCallback((target) => {
    setModalTarget(target);
    setIsFileModalOpen(true);
  }, []);

  const handleFileSelectedFromModal = (file) => {
    const imageUrl = file.path;
    if (modalTarget === "cover") {
      handleChangeFormFields({ ...formFields, coverImage: imageUrl });
    } else if (modalTarget === "editor") {
      editorRef.current?.insertImage(new URL(imageUrl, API_BASE_URL).href);
    }
    setIsFileModalOpen(false);
  };

  const loadPostBySlug = useCallback(async (currentSlug) => {
    if (!currentSlug) return;
    setFormFields(null);
    try {
      const data = await getPostBySlug(currentSlug);
      if (data) {
        setFormFields({
          ...data,
          postCategory: data.postCategory?._id || "",
        });
      } else {
        toast.error("Không tìm thấy bài viết.");
        setFormFields(null);
      }
    } catch (error) {
      toast.error("Lấy thông tin bài viết thất bại");
      setFormFields(null);
    }
  }, []);

  useEffect(() => {
    const slugFromUrl = searchParams.get("slug");
    if (slugFromUrl) {
      loadPostBySlug(slugFromUrl);
    } else {
      setFormFields(null);
      toast.warn("Không tìm thấy bài viết.");
    }
  }, [searchParams, loadPostBySlug]);

  const handleChangeFormFields = (updatedFields) => {
    setFormFields((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleChangeContent = useCallback((content) => {
    setFormFields((prev) => {
      if (!prev) return null;
      return { ...prev, content: content };
    });
  }, []);

  const handleSubmit = async () => {
    if (!formFields || !formFields.slug) {
      toast.warn("Vui lòng tải thông tin bài viết trước khi cập nhật.");
      return;
    }
    if (!formFields.postCategory) {
      toast.error("Vui lòng chọn danh mục bài viết");
      return;
    }
    try {
      let finalCoverImageUrl = formFields.coverImage;

      if (formFields.coverImage instanceof File) {
        finalCoverImageUrl = await uploadImage(
          formFields.coverImage,
          `${formFields.slug}_cover_${Date.now()}.jpg`
        );
      }

      const processedContent = await Promise.all(
        (formFields.content || []).map(async (block) => {
          if (
            block.type === "image" &&
            block.data.url &&
            block.data.url.startsWith("data:image/")
          ) {
            const imageName = `${
              formFields.slug || "post"
            }_content_${Date.now()}.jpg`;
            const imageFile = base64ToFile(block.data.url, imageName);
            const uploadedUrl = await uploadImage(imageFile, imageName);
            return { ...block, data: { ...block.data, url: uploadedUrl } };
          }
          return block;
        })
      );

      const payload = {
        title: formFields.title,
        slug: formFields.slug,
        excerpt: formFields.excerpt,
        coverImage: finalCoverImageUrl,
        author: formFields.author,
        tags: formFields.tags,
        status: formFields.status,
        content: processedContent,
        postCategory: formFields.postCategory,
      };

      const result = await updatePost(formFields.slug, payload);
      if (result.success) {
        toast.success(result.message || "Cập nhật bài viết thành công!");
      } else {
        toast.error(result.message || "Cập nhật bài viết thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      {formFields ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">Cập nhật bài viết</h1>
              <a
                href={`/ban-tin/${formFields.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                title="Xem bài viết"
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
                <span className="text-sm font-medium">Xem bài viết</span>
              </a>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PostInfo
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
                onOpenImageModal={() => handleOpenImageModal("cover")}
              />
              <ContentEditor
                ref={editorRef}
                content={formFields.content || []}
                onChangeContent={handleChangeContent}
                onOpenImageModal={() => handleOpenImageModal("editor")}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <TagsAndStatus
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
              />
              <CategorySelect
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Đang tải thông tin bài viết ...
        </div>
      )}

      <FileSelectModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileSelect={handleFileSelectedFromModal}
      />
    </div>
  );
}
