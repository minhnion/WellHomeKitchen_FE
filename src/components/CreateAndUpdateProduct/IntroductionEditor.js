"use client";
import {
  convertDeltaToStructuredContent,
  structuredContentToDelta,
} from "@/utils/quillUtils";
import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const IntroductionEditor = forwardRef(
  (
    { introductionContent = [], onChangeIntroductionContent, onOpenImageModal },
    ref
  ) => {
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const isInitializing = useRef(false);
    const lastUpdateRef = useRef(null);

    useImperativeHandle(ref, () => ({
      insertImage: (url) => {
        const quill = editorRef.current;
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url, "user");
        }
      },
    }));

    const debouncedUpdateParent = useCallback(
      (structuredData) => {
        if (lastUpdateRef.current) clearTimeout(lastUpdateRef.current);
        lastUpdateRef.current = setTimeout(() => {
          onChangeIntroductionContent?.(structuredData);
        }, 300);
      },
      [onChangeIntroductionContent]
    );

    const cleanupEditorInstance = useCallback(() => {
      if (editorRef.current) {
        editorRef.current.off("text-change");
        editorRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      setIsReady(false);
      isInitializing.current = false;
    }, []);

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
          cleanupEditorInstance();
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
            placeholder: "Giới thiệu sản phẩm...",
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
                    onOpenImageModal();
                  },
                },
              },
            },
          });
          editorRef.current = quill;
          quill.on("text-change", (delta, oldDelta, source) => {
            if (source === "user" && editorRef.current) {
              const currentDelta = editorRef.current.getContents();
              const structuredData =
                convertDeltaToStructuredContent(currentDelta);
              debouncedUpdateParent(structuredData);
            }
          });
          if (introductionContent && introductionContent.length > 0) {
            const initialDelta = structuredContentToDelta(introductionContent);
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
        cleanupEditorInstance();
      };
    }, []);

    useEffect(() => {
      if (!editorRef.current || !isReady) return;
      const currentEditorDelta = editorRef.current.getContents();
      if (!introductionContent || introductionContent.length === 0) {
        const isQuillEffectivelyEmpty =
          currentEditorDelta.ops.length === 0 ||
          (currentEditorDelta.ops.length === 1 &&
            currentEditorDelta.ops[0].insert === "\n" &&
            Object.keys(currentEditorDelta.ops[0].attributes || {}).length ===
              0);
        if (!isQuillEffectivelyEmpty) {
          editorRef.current.setContents({ ops: [] }, "silent");
        }
      } else {
        const structuredFromEditor =
          convertDeltaToStructuredContent(currentEditorDelta);
        if (
          JSON.stringify(structuredFromEditor) !==
          JSON.stringify(introductionContent)
        ) {
          const newDelta = structuredContentToDelta(introductionContent);
          editorRef.current.setContents(newDelta, "silent");
        }
      }
    }, [introductionContent, isReady]);

    return (
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Bài viết giới thiệu
        </h3>
        <div>
          <label className="text-sm text-gray-500 mb-1 block">
            Mô tả (Tùy chọn)
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
      </div>
    );
  }
);

IntroductionEditor.displayName = "IntroductionEditor";
export default React.memo(IntroductionEditor);
