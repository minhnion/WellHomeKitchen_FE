"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ChevronRight, Plus, Minus } from "lucide-react";
import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";

export default function CategoryMenu({ categories = [] }) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isHoverSupported, setIsHoverSupported] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsHoverSupported(mediaQuery.matches);
    const handleChange = (e) => setIsHoverSupported(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (menuRef.current && !menuRef.current.contains(event.target)) &&
        (popupRef.current && !popupRef.current.contains(event.target))
      ) {
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đóng popup khi mouse leave menu
  const handleMenuMouseLeave = () => {
    if (isHoverSupported) {
      timeoutRef.current = setTimeout(() => {
        setActiveCategory(null);
      }, 300);
    }
  };

  // Giữ popup mở khi hover vào popup
  const handlePopupMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Đóng popup khi mouse leave popup
  const handlePopupMouseLeave = () => {
    if (isHoverSupported) {
      timeoutRef.current = setTimeout(() => {
        setActiveCategory(null);
      }, 300);
    }
  };

  const handleCategorySelect = (category, event) => {
    // Clear timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setPopupPosition({
        top: rect.top,
        left: rect.right + 10
      });
    }
    setActiveCategory(category);
  };

  const handleCategoryClick = (category, e) => {
    e.preventDefault();
    handleCategorySelect(category, e);
  };

  const toggleShowAll = () => {
    setShowAllCategories(!showAllCategories);
  };

  // Lấy danh sách categories để hiển thị
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 10);

  return (
    <div className="md:relative" ref={menuRef}>
      <div className="flex items-center px-4 py-2 rounded-md bg-white text-[#263B96]">
        <Menu className="w-5 h-5 text-[#263B96]" />
        <span className="ml-2 text-base font-bold">DANH MỤC SẢN PHẨM</span>
      </div>

      {categories.length > 0 && (
        <>
          {/* Menu chính - chỉ chứa danh sách categories */}
          <div
            className={`absolute left-0 mx-2 md:mx-0 top-full bg-white shadow-xl w-56 md:w-62 z-50 overflow-hidden border border-gray-100 h-150 overflow-y-auto ${showCategoryMenu ? "transition-transform duration-300" : ""}`}
          >
            <div className="bg-white text-xs md:text-sm">
              {displayedCategories.map((category) => (
                <div
                  key={category._id}
                  onMouseEnter={
                    isHoverSupported
                      ? (e) => handleCategorySelect(category, e)
                      : undefined
                  }
                  onClick={(e) => handleCategoryClick(category, e)}
                >
                  <div className={`flex items-center justify-between py-2 px-2 cursor-pointer transition-all duration-200 relative ${activeCategory && activeCategory._id === category._id
                    ? "bg-blue-50 text-[#C94669] border-l-4 border-[#263B96]"
                    : "hover:bg-gray-50"
                    }`}>
                    {/* Dấu gạch xanh dọc */}
                    <span className="font-semibold">
                      {category.name}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 ${activeCategory && activeCategory._id === category._id
                        ? "text-blue-600"
                        : "text-gray-400"
                        }`}
                    />
                  </div>
                </div>
              ))}

              {/* Mục "Thông tin" - chỉ hiện khi xem thêm */}
              {showAllCategories && (
                <div>
                  <div
                    className="px-2 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
                    onClick={() => {
                      setShowCategoryMenu(false);
                      setShowAllCategories(false);
                      window.location.href = "/";
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Thông tin</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nút Xem thêm / Ẩn bớt */}
              {categories.length > 10 && (
                <div>
                  <button
                    onClick={toggleShowAll}
                    className="w-full px-2 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between text-blue-600 font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      {showAllCategories ? (
                        <Minus className="w-4 h-4" /> // Icon - cho Ẩn bớt
                      ) : (
                        <Plus className="w-4 h-4" /> // Icon + cho Xem thêm
                      )}
                      <span>{showAllCategories ? "Ẩn bớt" : "Xem thêm"}</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Khoảng trống để giữ chiều cao cố định khi chưa xem thêm */}
              {!showAllCategories && categories.length > 10 && (
                <div className="h-32 bg-white"></div>
              )}
            </div>
          </div>

          {/* Popup thông tin sản phẩm - khung riêng biệt */}
          {activeCategory && (
            <div
              ref={popupRef}
              className="fixed bg-white shadow-2xl rounded-lg z-50 border border-gray-200 min-w-[600px] max-w-[800px] max-h-[80vh] overflow-y-auto"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
              }}
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
            >
              <div className="p-6 flex gap-6">
                {activeCategory.brands && activeCategory.brands.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#263B96] mb-3 text-sm uppercase tracking-wide">
                      THƯƠNG HIỆU NỔI BẬT
                    </h4>
                    <div className="flex flex-col gap-4">
                      {activeCategory.brands.map((brand) => (
                        <Link
                          href={`/${activeCategory.slug}/${brand.slug}`}
                          key={brand._id}
                          onClick={() => setShowCategoryMenu(false)}
                          className="group flex items-center transition-transform hover:scale-105"
                        >
                          <span className="font-medium text-sm">
                            {brand.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic mb-4">
                    Chưa có thương hiệu cho danh mục này
                  </p>
                )}

                {activeCategory.subcategories &&
                  activeCategory.subcategories.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-[#263B96] mb-3 text-sm uppercase tracking-wide">
                      PHÂN LOẠI SẢN PHẨM
                    </h4>
                    <div className="flex flex-col gap-4">
                      {activeCategory.subcategories.map((sub) => (
                        <Link
                          href={`/${activeCategory.slug}/${sub.slug}`}
                          key={sub._id}
                          onClick={() => setShowCategoryMenu(false)}
                          className="group flex items-center transition-transform hover:scale-105"
                        >
                          <span className="font-medium text-sm">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Chưa có phân loại cho danh mục này
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}