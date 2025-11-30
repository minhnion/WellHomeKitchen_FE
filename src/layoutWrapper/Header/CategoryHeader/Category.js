"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ChevronRight, Plus, Minus } from "lucide-react";
import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function CategoryMenu({ categories = [], isMobile = false }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // QUAN TRỌNG: Trang chủ luôn hiện, trang khác BAN ĐẦU = false
  const [showCategoryMenu, setShowCategoryMenu] = useState(isHomePage && !isMobile);
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

  // Reset menu state khi chuyển trang
  useEffect(() => {
    setShowCategoryMenu(isHomePage && !isMobile);
    setActiveCategory(null);
  }, [pathname, isHomePage, isMobile]);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (menuRef.current && !menuRef.current.contains(event.target)) &&
        (popupRef.current && !popupRef.current.contains(event.target))
      ) {
        setActiveCategory(null);
        if (isMobile || !isHomePage) {
          setShowCategoryMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isHomePage]);

  // Đóng popup khi mouse leave menu
  const handleMenuMouseLeave = () => {
    if (isHoverSupported && !isMobile) {
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
    if (isHoverSupported && !isMobile) {
      timeoutRef.current = setTimeout(() => {
        setActiveCategory(null);
      }, 300);
    }
  };

  const handleCategorySelect = (category, event) => {
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

  const toggleMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
    setActiveCategory(null);
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 10);

  return (
    <div className={`${isMobile ? 'relative' : 'md:relative'}`} ref={menuRef}>
      {/* Header button */}
      <div
        className={`flex items-center rounded-md ${isMobile
          ? 'p-2 bg-transparent text-white cursor-pointer'
          : `px-4 py-2 bg-white text-[#263B96] ${!isHomePage ? 'cursor-pointer' : ''}`
          }`}
        onClick={!isHomePage ? toggleMenu : undefined}
      >
        <Menu className={`w-5 h-5 ${isMobile ? 'text-white' : 'text-[#263B96]'}`} />
        {!isMobile && (
          <span className="ml-2 text-base font-bold">DANH MỤC SẢN PHẨM</span>
        )}
      </div>

      {categories.length > 0 && showCategoryMenu && (
        <>
          {/* Menu chính */}
          <div
            className={`${isMobile
              ? 'fixed left-4 right-4 top-[140px]'
              : 'absolute left-0 mx-0 top-full'
              } bg-white shadow-xl ${isMobile ? 'w-auto' : 'w-62'} z-50 overflow-hidden border border-gray-100 transition-transform duration-300`}
            onMouseLeave={!isMobile ? handleMenuMouseLeave : undefined}
          >
            <div className="bg-white text-xs md:text-sm">
              {displayedCategories.map((category) => (
                <div
                  key={category._id}
                  onMouseEnter={
                    isHoverSupported && !isMobile
                      ? (e) => handleCategorySelect(category, e)
                      : undefined
                  }
                  onClick={(e) => handleCategoryClick(category, e)}
                >
                  <div className={`flex items-center justify-between py-2 px-2 cursor-pointer transition-all duration-200 relative ${activeCategory && activeCategory._id === category._id
                    ? "bg-blue-50 text-[#C94669] border-l-4 border-[#263B96]"
                    : "hover:bg-gray-50"
                    }`}>
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

              {categories.length > 10 && (
                <div>
                  <button
                    onClick={toggleShowAll}
                    className="w-full px-2 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between text-blue-600 font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      {showAllCategories ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>{showAllCategories ? "Ẩn bớt" : "Xem thêm"}</span>
                    </div>
                  </button>
                </div>
              )}

              {!showAllCategories && categories.length > 10 && !isMobile && (
                <div className="h-32 bg-white"></div>
              )}
            </div>
          </div>

          {/* Popup thông tin sản phẩm */}
          {activeCategory && !isMobile && (
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
                          onClick={() => {
                            if (!isHomePage) {
                              setShowCategoryMenu(false);
                            }
                          }}
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
                          onClick={() => {
                            if (!isHomePage) {
                              setShowCategoryMenu(false);
                            }
                          }}
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

          {/* Hiển thị subcategories trực tiếp trên mobile */}
          {activeCategory && isMobile && (
            <div className="fixed left-4 right-4 top-[140px] bg-white shadow-xl z-[60] border border-gray-200 rounded-lg">
              <div className="p-4">
                <h3 className="font-bold text-[#263B96] mb-3 pb-2 border-b">
                  {activeCategory.name}
                </h3>

                {activeCategory.brands && activeCategory.brands.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                      THƯƠNG HIỆU NỔI BẬT
                    </h4>
                    <div className="flex flex-col gap-2">
                      {activeCategory.brands.map((brand) => (
                        <Link
                          href={`/${activeCategory.slug}/${brand.slug}`}
                          key={brand._id}
                          onClick={() => {
                            setShowCategoryMenu(false);
                            setActiveCategory(null);
                          }}
                          className="text-sm text-gray-600 hover:text-[#263B96] py-1"
                        >
                          {brand.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                      PHÂN LOẠI SẢN PHẨM
                    </h4>
                    <div className="flex flex-col gap-2">
                      {activeCategory.subcategories.map((sub) => (
                        <Link
                          href={`/${activeCategory.slug}/${sub.slug}`}
                          key={sub._id}
                          onClick={() => {
                            setShowCategoryMenu(false);
                            setActiveCategory(null);
                          }}
                          className="text-sm text-gray-600 hover:text-[#263B96] py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(!activeCategory.brands || activeCategory.brands.length === 0) &&
                  (!activeCategory.subcategories || activeCategory.subcategories.length === 0) && (
                    <p className="text-gray-500 text-sm italic">
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