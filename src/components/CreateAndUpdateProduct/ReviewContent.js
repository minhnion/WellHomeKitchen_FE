"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";

const ReviewContent = ({ introductionContent = [], onChangeReviewContent }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Chuyển đổi Delta của Quill sang định dạng structured content
  const convertDeltaToStructuredContent = useCallback((delta) => {
    const content = [];
    let currentList = null;

    if (!delta || !delta.ops) return content;

    delta.ops.forEach((op) => {
      if (op.insert && typeof op.insert === "string") {
        const text = op.insert.trim();
        if (!text) return;

        if (op.attributes) {
          if (op.attributes.header) {
            content.push({
              type: "heading",
              data: { text, level: op.attributes.header },
            });
          } else if (op.attributes.list) {
            if (
              !currentList ||
              currentList.ordered !== (op.attributes.list === "ordered")
            ) {
              currentList = {
                type: "list",
                data: {
                  items: [text],
                  ordered: op.attributes.list === "ordered",
                },
              };
              content.push(currentList);
            } else {
              currentList.data.items.push(text);
            }
          } else {
            let formattedText = text;
            if (op.attributes.bold)
              formattedText = `<strong>${formattedText}</strong>`;
            if (op.attributes.italic)
              formattedText = `<em>${formattedText}</em>`;
            if (op.attributes.underline)
              formattedText = `<u>${formattedText}</u>`;
            content.push({ type: "paragraph", data: { text: formattedText } });
          }
        } else {
          content.push({ type: "paragraph", data: { text } });
        }
      } else if (op.insert && op.insert.image) {
        content.push({
          type: "image",
          data: { url: op.insert.image, caption: "", alt: "Product Image" },
        });
        currentList = null;
      }
    });

    return content;
  }, []);

  const structuredContentToDelta = useCallback((content) => {
    const deltaOps = [];
    content.forEach((block) => {
      if (block.type === "paragraph") {
        deltaOps.push({ insert: block.data.text + "\n" });
      } else if (block.type === "heading") {
        deltaOps.push({
          insert: block.data.text + "\n",
          attributes: { header: block.data.level },
        });
      } else if (block.type === "list") {
        block.data.items.forEach((item) => {
          deltaOps.push({
            insert: item + "\n",
            attributes: { list: block.data.ordered ? "ordered" : "bullet" },
          });
        });
      } else if (block.type === "image") {
        deltaOps.push({ insert: { image: block.data.url } });
        deltaOps.push({ insert: "\n" });
      }
    });
    return { ops: deltaOps };
  }, []);

  // Cleanup function
  const cleanupEditor = useCallback(() => {
    if (editorRef.current) {
      try {
        editorRef.current.off("text-change");
      } catch (error) {
        console.log("Error cleaning up editor:", error);
      }
      editorRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    setIsReady(false);
  }, []);

  // Initialize editor
  useEffect(() => {
    let isMounted = true;

    const initializeEditor = async () => {
      if (typeof window === "undefined" || !containerRef.current) return;

      try {
        // Clean up any existing editor
        cleanupEditor();

        // Dynamic import
        const [QuillModule] = await Promise.all([
          import("quill"),
          import("quill/dist/quill.snow.css"),
        ]);

        if (!isMounted) return;

        const Quill = QuillModule.default;

        // Create fresh div for Quill
        const editorDiv = document.createElement("div");
        editorDiv.style.minHeight = "200px";
        containerRef.current.appendChild(editorDiv);

        const quill = new Quill(editorDiv, {
          theme: "snow",
          placeholder: "Đánh giá sản phẩm",
          modules: {
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image"],
            ],
          },
        });

        editorRef.current = quill;

        const handleTextChange = () => {
          if (!editorRef.current) return;
          const delta = editorRef.current.getContents();
          const structuredContent = convertDeltaToStructuredContent(delta);
          onChangeReviewContent?.(structuredContent);
        };

        quill.on("text-change", handleTextChange);

        // Set initial content if exists
        if (introductionContent && introductionContent.length > 0) {
          const delta = structuredContentToDelta(introductionContent);
          quill.setContents(delta);
        }

        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error("Error initializing Quill:", error);
      }
    };

    initializeEditor();

    return () => {
      isMounted = false;
      cleanupEditor();
    };
  }, [editorKey]);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Đánh giá chi tiết
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">
            Mô tả (Tùy chọn)
          </label>
          <div
            key={editorKey}
            ref={containerRef}
            className="border border-gray-300 rounded-lg text-sm text-gray-700"
            style={{ minHeight: "200px" }}
          />
          {!isReady && (
            <div className="text-center text-gray-500 text-sm mt-2">
              Loading editor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewContent;
