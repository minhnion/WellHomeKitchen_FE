"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";


export default function ContentViewer({ content }) {
  const [isContentTaller, setIsContentTaller] = useState(false);
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);

  const collapsedMaxHeight = 500;

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > collapsedMaxHeight) {
        setIsContentTaller(true);
      } else {
        setIsContentTaller(false);
      }
    }
  }, [content]);

  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <p className="text-gray-500 italic">Nội dung đang được cập nhật...</p>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">

      <div
        ref={contentRef}
        className="prose lg:prose-xl max-w-none"
      >
        {content.map((block, index) => {
          const key = block._id || `block-${index}`;

          switch (block.type) {
            case "heading":
              const HeadingTag = `h${block.data.level}`;
              return (
                <HeadingTag
                  key={key}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              );

            case "paragraph":
              return (
                <p
                  key={key}
                  dangerouslySetInnerHTML={{ __html: block.data.text }}
                />
              );

            case "list":
              const ListTag = block.data.ordered ? "ol" : "ul";
              return (
                <ListTag
                  key={key}
                  className={
                    block.data.ordered
                      ? "list-decimal list-outside pl-5"
                      : "list-disc list-outside pl-5"
                  }
                >
                  {block.data.items.map((item, i) => (
                    <li
                      key={`${key}-item-${i}`}
                      className="mb-1"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </ListTag>
              );

            case "image":
              if (!block.data.url) return null;
              return (
                <figure key={key} className="my-6">
                  <Image
                    src={block.data.url}
                    alt={block.data.alt || "Hình ảnh nội dung"}
                    width={800}
                    height={450}
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                  />
                </figure>
              );

            case "checklist":
              return (
                <div key={key} className="mb-4">
                  {block?.data?.items?.map((item, i) => (
                    <div key={i} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        readOnly
                        checked={item.checked}
                        className="mr-2"
                      />
                      <span dangerouslySetInnerHTML={{ __html: item.text }} />
                    </div>
                  ))}
                </div>
              );

            case "embed":
              return (
                <div key={key} className="mb-6">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-md"
                      src={block.data.embed}
                      title={block.data.caption || "Embedded content"}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>


    </div>
  );
}