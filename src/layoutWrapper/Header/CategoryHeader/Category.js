"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ChevronUp, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";

export default function CategoryMenu({ categories = [] }) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    categories.length > 0 ? categories[0] : null
  );
  const [isHoverSupported, setIsHoverSupported] = useState(true);
  const timeoutRef = useRef(null);
  const categoryListRef = useRef(null);
  const menuRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsHoverSupported(mediaQuery.matches);
    const handleChange = (e) => setIsHoverSupported(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (categoryListRef.current) {
      const element = categoryListRef.current;
      setShowScrollButtons(element.scrollHeight > element.clientHeight);
      // Reset scroll position when menu is opened
      if (showCategoryMenu) {
        element.scrollTop = 0;
        setScrollPosition(0);
      }
    }
  }, [showCategoryMenu]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const handleMouseEnter = () => {
    if (isHoverSupported) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setShowCategoryMenu(true);
    }
  };

  const handleMouseLeave = () => {
    if (isHoverSupported) {
      timeoutRef.current = setTimeout(() => {
        setShowCategoryMenu(false);
      }, 100);
    }
  };

  // Add a new function to handle document clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
      }
    };

    if (showCategoryMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryMenu]);

  const toggleMenu = () => {
    if (!isHoverSupported) {
      setShowCategoryMenu((prev) => !prev);
    }
  };

  const handleScroll = (direction) => {
    if (categoryListRef.current) {
      const scrollAmount = 200;
      const currentScroll = categoryListRef.current.scrollTop;
      const newPosition =
        direction === "up"
          ? Math.max(0, currentScroll - scrollAmount)
          : currentScroll + scrollAmount;

      categoryListRef.current.scrollTo({
        top: newPosition,
        behavior: "smooth",
      });

      setScrollPosition(newPosition);
    }
  };

  // Hàm kiểm tra xem có thể scroll xuống không
  const canScrollDown = () => {
    if (!categoryListRef.current) return false;
    const element = categoryListRef.current;
    return element.scrollTop + element.clientHeight < element.scrollHeight - 5; // Thêm tolerance 5px
  };

  return (
    <div className="md:relative" ref={menuRef}>
      <button
        className={`ml-62 flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${showCategoryMenu
          ? "bg-white text-[#263B96]"
          : "text-[#263B96] hover:bg-white-700"
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleMenu}
      >
        <Menu className={`w-5 h-5 ${showCategoryMenu ? "text-[#263B96]" : ""}`} />
        <span className="ml-2 text-sm font-medium">DANH MỤC SẢN PHẨM</span>
      </button>

      {showCategoryMenu && categories.length > 0 && (
        <div
          className={`absolute left-65 mx-2 md:mx-0 top-full bg-white shadow-xl rounded-lg md:w-[min(100vw-2rem,70vw)] lg:w-[min(100vw-2rem,65vw)] xl:w-[min(100vw-2rem,60vw)] flex z-50 overflow-hidden border border-gray-100 ${showCategoryMenu ? "transition-transform duration-300" : ""
            }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Danh sách danh mục có giới hạn chiều cao và cuộn */}
          <div className="w-56 md:w-48 border-r border-gray-100 relative">
            {/* Nút cuộn lên - chỉ hiển thị khi scrollPosition > 5 */}
            {showScrollButtons && scrollPosition > 5 && (
              <button
                onClick={() => handleScroll("up")}
                className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-90 flex justify-center shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronUp className="text-gray-600" />
              </button>
            )}

            {/* Danh sách danh mục có thể cuộn */}
            <div
              ref={categoryListRef}
              className="max-h-96 bg-gray-100 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-xs md:text-sm "
              onScroll={(e) => setScrollPosition(e.target.scrollTop)}
            >
              {categories.map((category) => (
                <Link
                  href={`/${category.slug}`}
                  key={category._id}
                  onClick={() => setShowCategoryMenu(false)}
                >
                  <div
                    className={`px-2 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between border border-gray-200 ${activeCategory && activeCategory._id === category._id
                      ? "bg-gray-50 font-medium text-blue-600"
                      : ""
                      }`}
                    onMouseEnter={
                      isHoverSupported
                        ? () => handleCategorySelect(category)
                        : undefined
                    }
                    onClick={
                      !isHoverSupported
                        ? () => handleCategorySelect(category)
                        : undefined
                    }
                  >
                    {category.imageUrl && (
                      <Image
                        src={new URL(category.imageUrl, API_BASE_URL).href}
                        alt={category.name}
                        className="w-6 h-6 object-contain"
                        width={24}
                        height={24}
                      />
                    )}
                    <span>{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Nút cuộn xuống - chỉ hiển thị khi có thể scroll xuống */}
            {showScrollButtons && canScrollDown() && (
              <button
                onClick={() => handleScroll("down")}
                className="absolute bottom-0 left-65 right-0 z-10 bg-white bg-opacity-90 flex justify-center shadow-md hover:bg-gray-100 transition-colors"
              >
                <ChevronDown className="text-gray-600" />
              </button>
            )}
          </div>

          {/* Nội dung danh mục đang chọn */}
          {activeCategory && (
            <div className="w-full md:flex-1 pl-4 py-4">
              <h3 className="font-bold text-gray-800 border-b pb-2">
                {activeCategory.name}
              </h3>

              {activeCategory.brands && activeCategory.brands.length > 0 ? (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    THƯƠNG HIỆU NỔI BẬT
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-10">
                    {activeCategory.brands.map((brand) => (
                      <Link
                        href={`/${activeCategory.slug}/${brand.slug}`}
                        key={brand._id}
                        onClick={() => setShowCategoryMenu(false)}
                        className="group flex flex-col items-center transition-transform hover:scale-105"
                      >
                        <div className="bg-gray-50 w-15 h-15 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <Image
                            src={new URL(brand.imageUrl, API_BASE_URL).href}
                            alt={brand.name}
                            className="w-full h-full object-contain"
                            width={64}
                            height={64}
                          />
                        </div>
                        <span className="font-medium text-sm">
                          {brand.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic mb-2 md:mb-4">
                  Chưa có thương hiệu cho danh mục này
                </p>
              )}

              {activeCategory.subcategories &&
                activeCategory.subcategories.length > 0 ? (
                <div className="mb-2">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">
                    PHÂN LOẠI SẢN PHẨM
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    {activeCategory.subcategories.map((sub) => (
                      <Link
                        href={`/${activeCategory.slug}/${sub.slug}`}
                        key={sub._id}
                        onClick={() => setShowCategoryMenu(false)}
                        className="group flex flex-col items-center transition-transform hover:scale-105"
                      >
                        <div className="bg-gray-50 w-15 h-15 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <Image
                            src={new URL(sub.imageUrl, API_BASE_URL).href}
                            alt={sub.name}
                            className="w-full h-full object-contain"
                            width={64}
                            height={64}
                          />
                        </div>
                        <span className="font-medium text-sm text-center">
                          {sub.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic mb-2 md:mb-6">
                  Chưa có phân loại cho danh mục này
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
