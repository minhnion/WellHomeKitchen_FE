"use client";

import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import Embed from "@editorjs/embed";
import Checklist from "@editorjs/checklist";

export default function ContentEditor({
  initialData = null,
  onSave,
  editorId = "editor",
  readOnly = false,
}) {
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Xử lý tải ảnh lên server
  const handleImageUpload = async (file) => {
    try {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append("image", file);

      // Gọi API upload ảnh của bạn
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Trả về object chứa url của ảnh đã upload
      return {
        success: 1,
        file: {
          url: data.url,
        },
      };
    } catch (error) {
      console.error("Upload image failed", error);
      return {
        success: 0,
        file: {
          url: null,
        },
      };
    }
  };

  // Khởi tạo Editor
  useEffect(() => {
    if (typeof window !== "undefined" && !editorRef.current) {
      setIsMounted(true);

      const editor = new EditorJS({
        holder: editorId,
        readOnly,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile: handleImageUpload,
              },
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                vimeo: true,
              },
            },
          },
        },
        data: initialData || {},
        onChange: () => {
          // Có thể thêm xử lý onChange nếu cần
        },
        placeholder: "Thêm nội dung tại đây...",
      });

      editorRef.current = editor;

      // Cleanup function
      return () => {
        if (editorRef.current && editorRef.current.destroy) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [editorId, readOnly, initialData]);

  // Function để lấy dữ liệu
  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const outputData = await editorRef.current.save();

        // Chuyển đổi format từ Editor.js sang format của bạn
        const formattedData = outputData.blocks.map((block) => {
          return {
            type: block.type,
            data: block.data,
          };
        });

        // Gọi callback để lưu dữ liệu
        onSave(formattedData);
      } catch (error) {
        console.error("Saving data failed", error);
      }
    }
  };

  // Hiển thị button Save chỉ khi không ở chế độ readOnly
  return (
    <div className="content-editor">
      <div
        id={editorId}
        className="prose max-w-none mb-4 min-h-[200px] border border-gray-200 rounded-md p-4"
      />

      {!readOnly && (
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Lưu
          </button>
        </div>
      )}
    </div>
  );
}
