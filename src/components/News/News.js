"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "./NewsCard/NewsCard";
import Link from "next/link";

export default function News({ categoriesWithPosts }) {
  const scrollContainerRef = useRef(null);
  const categoryScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showCategoryLeftArrow, setShowCategoryLeftArrow] = useState(false);
  const [showCategoryRightArrow, setShowCategoryRightArrow] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    categoriesWithPosts[0]?._id || null
  );

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const checkCategoryScroll = () => {
      if (!categoryScrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } =
        categoryScrollRef.current;

      setShowCategoryLeftArrow(scrollLeft > 0);
      setShowCategoryRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const container = categoryScrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkCategoryScroll);
      checkCategoryScroll();
      return () => container.removeEventListener("scroll", checkCategoryScroll);
    }
  }, [categoriesWithPosts]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollCategory = (direction) => {
    if (!categoryScrollRef.current) return;
    const container = categoryScrollRef.current;
    const scrollAmount = container.clientWidth * 0.6;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const currentCategory =
    categoriesWithPosts.find((cat) => cat._id === selectedCategory) ||
    categoriesWithPosts[0];

  const posts = currentCategory?.posts || [];

  return (
    <div className="bg-white rounded-xl p-4 relative text-base md:text-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Bản tin</h2>
      </div>

      <div className="relative mb-4">
        {showCategoryLeftArrow && (
          <button
            onClick={() => scrollCategory("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md flex items-center justify-center"
            aria-label="Cuộn danh mục sang trái"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {showCategoryRightArrow && (
          <button
            onClick={() => scrollCategory("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 rounded-full shadow-md flex items-center justify-center"
            aria-label="Cuộn danh mục sang phải"
          >
            <ChevronRight size={20} />
          </button>
        )}
        <div
          ref={categoryScrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-none px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categoriesWithPosts.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedCategory === category._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md flex items-center justify-center"
          aria-label="Cuộn tin tức sang trái"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md flex items-center justify-center"
          aria-label="Cuộn tin tức sang phải"
        >
          <ChevronRight size={24} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="p-4 rounded-lg overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex flex-nowrap gap-x-2">
          {posts.length > 0 ? (
            posts.map((post) => {
              const categoryPath = post.categoryHierarchy
                .map((cat) => cat.slug)
                .join("/");

              const fullPostUrl = `/ban-tin/${categoryPath}/${post.slug}`;

              return (
                <Link
                  href={fullPostUrl}
                  key={post._id}
                  className="max-w-56 flex-shrink-0"
                >
                  <NewsCard
                    coverImage={post.coverImage}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.createdAt}
                  />
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500 text-center w-full">
              Không có bài viết trong danh mục này
            </p>
          )}
        </div>
      </div>

      {currentCategory && posts.length > 0 && (
        <div className="mt-6 flex justify-center">
          {(() => {
            return (
              <Link
                href={`/ban-tin/${currentCategory.slug}`}
                className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                Xem thêm {currentCategory.name.toLowerCase()}
                <ArrowRight size={20} className="ml-1" />
              </Link>
            );
          })()}
        </div>
      )}
    </div>
  );
}
