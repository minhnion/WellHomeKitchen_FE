"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { createPost } from "@/apiServices/posts";
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

export default function AddPostPage() {
  const [formFields, setFormFields] = useState({
    title: "",
    excerpt: "",
    coverImage: null,
    author: { name: "" },
    tags: [],
    status: "draft",
    content: [],
    postCategory: "",
  });

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
      handleChangeFormFields({ coverImage: imageUrl });
    } else if (modalTarget === "editor") {
      editorRef.current?.insertImage(new URL(imageUrl, API_BASE_URL).href);
    }
    setIsFileModalOpen(false);
  };

  const handleChangeFormFields = useCallback((updatedFields) => {
    setFormFields((prev) => ({ ...prev, ...updatedFields }));
  }, []);

  const handleChangeContent = useCallback((content) => {
    setFormFields((prev) => ({ ...prev, content }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      if (!formFields.postCategory) {
        toast.error("Vui lòng chọn danh mục bài viết");
        return;
      }
      let coverImageUrl = "";
      if (formFields.coverImage) {
        if (formFields.coverImage instanceof File) {
          coverImageUrl = await uploadImage(
            formFields.coverImage,
            `${formFields.slug || "post"}-cover-${Date.now()}.jpg`
          );
        } else if (typeof formFields.coverImage === "string") {
          coverImageUrl = formFields.coverImage;
        }
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
        coverImage: coverImageUrl,
        author: formFields.author,
        tags: formFields.tags,
        status: formFields.status,
        content: processedContent,
        postCategory: formFields.postCategory,
      };

      const response = await createPost(payload);
      if (response.success) {
        toast.success(response.message || "Thêm bài viết thành công!");
        setFormFields({
          title: "",
          slug: "",
          excerpt: "",
          coverImage: null,
          author: { name: "" },
          tags: [],
          status: "draft",
          content: [],
          postCategory: "",
        });
      } else {
        toast.error(response.message || "Thêm bài viết thất bại");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";
      toast.error(errorMessage);
    }
  }, [formFields]);

  return (
    <div className="max-w-8xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Thêm bài viết mới</h1>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Tạo bài viết
          </button>
        </div>
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
            content={formFields.content}
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

      <FileSelectModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileSelect={handleFileSelectedFromModal}
      />
    </div>
  );
}
