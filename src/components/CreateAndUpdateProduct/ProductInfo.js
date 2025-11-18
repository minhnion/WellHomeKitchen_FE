"use client";
import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";
import { deltaToHtml, htmlToDelta } from "@/utils/quillUtils";

const ProductInfo = forwardRef(
  ({ formFields, onChangeFormFields, onOpenImageModal }, ref) => {
    const [previewUrl, setPreviewUrl] = useState("");
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const isInitializing = useRef(false);
    const lastUpdateRef = useRef(null);

    // Handle main image preview
    useEffect(() => {
      if (!formFields.mainImage) {
        setPreviewUrl("");
        return;
      }
      if (typeof formFields.mainImage === "string") {
        try {
          setPreviewUrl(new URL(formFields.mainImage, API_BASE_URL).href);
        } catch (e) {
          setPreviewUrl("");
        }
        return;
      }
      if (formFields.mainImage instanceof File) {
        const objectUrl = URL.createObjectURL(formFields.mainImage);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    }, [formFields.mainImage]);

    // Initialize Quill Editor for description
    useEffect(() => {
      let isMounted = true;
      const initialize = async () => {
        if (
          typeof window === "undefined" ||
          !containerRef.current ||
          isInitializing.current ||
          !isMounted
        )
          return;
        isInitializing.current = true;
        try {
          const [QuillModule] = await Promise.all([
            import("quill"),
            import("quill/dist/quill.snow.css"),
          ]);
          if (!isMounted || !containerRef.current) return;
          const Quill = QuillModule.default;
          const editorDiv = document.createElement("div");
          editorDiv.style.minHeight = "200px";
          containerRef.current.appendChild(editorDiv);
          const quill = new Quill(editorDiv, {
            theme: "snow",
            placeholder: "Mô tả ngắn gọn sản phẩm...",
            modules: {
              toolbar: {
                container: [
                  ["bold", "italic", "underline"],
                  [{ header: [1, 2, 3, false] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                ],
                handlers: {
                  image: () => {
                    onOpenImageModal("description");
                  },
                },
              },
            },
          });
          editorRef.current = quill;
          quill.on("text-change", (delta, oldDelta, source) => {
            if (source === "user" && editorRef.current) {
              const currentDelta = editorRef.current.getContents();
              const htmlContent = deltaToHtml(currentDelta);
              if (lastUpdateRef.current) clearTimeout(lastUpdateRef.current);
              lastUpdateRef.current = setTimeout(() => {
                onChangeFormFields({ ...formFields, description: htmlContent });
              }, 300);
            }
          });
          if (formFields.description) {
            const initialDelta = htmlToDelta(formFields.description);
            quill.setContents(initialDelta, "silent");
          }
          if (isMounted) setIsReady(true);
        } catch (error) {
          console.error("Lỗi khởi tạo Quill Editor:", error);
          if (isMounted) isInitializing.current = false;
        }
      };
      initialize();
      return () => {
        isMounted = false;
        if (lastUpdateRef.current) clearTimeout(lastUpdateRef.current);
        if (editorRef.current) {
          editorRef.current.off("text-change");
          editorRef.current = null;
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        setIsReady(false);
        isInitializing.current = false;
      };
    }, []);

    // Sync description with editor
    useEffect(() => {
      if (!editorRef.current || !isReady) return;
      const currentEditorDelta = editorRef.current.getContents();
      const currentHtml = deltaToHtml(currentEditorDelta);
      if (!formFields.description) {
        const isQuillEffectivelyEmpty =
          currentEditorDelta.ops.length === 0 ||
          (currentEditorDelta.ops.length === 1 &&
            currentEditorDelta.ops[0].insert === "\n" &&
            Object.keys(currentEditorDelta.ops[0].attributes || {}).length === 0);
        if (!isQuillEffectivelyEmpty) {
          editorRef.current.setContents({ ops: [] }, "silent");
        }
      } else if (currentHtml !== formFields.description) {
        const newDelta = htmlToDelta(formFields.description);
        editorRef.current.setContents(newDelta, "silent");
      }
    }, [formFields.description, isReady]);

    // Expose insertImage method for FileSelectModal
    useImperativeHandle(ref, () => ({
      insertImage: (url) => {
        const quill = editorRef.current;
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url, "user");
        }
      },
    }));

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onChangeFormFields({ ...formFields, mainImage: file });
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      onChangeFormFields({ ...formFields, [name]: value });
    };

    return (
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm (*)
              </label>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Tên sản phẩm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU (*)
              </label>
              <input
                type="text"
                name="sku"
                value={formFields.sku}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="SKU"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả (*)
              </label>
              <div
                ref={containerRef}
                className="border border-gray-300 rounded-lg text-sm text-gray-700 quill-editor-container"
                style={{ minHeight: "200px" }}
              />
              {!isReady && (
                <div className="text-center text-gray-500 text-sm mt-2">
                  Đang tải trình soạn thảo...
                </div>
              )}
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
                onClick={() => onOpenImageModal("mainImage")}
                className="w-full text-sm py-1.5 px-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Chọn từ hệ thống
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductInfo.displayName = "ProductInfo";
export default React.memo(ProductInfo);