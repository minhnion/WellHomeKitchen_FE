"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ChevronRight, Plus, Minus, X } from "lucide-react"; // Thêm X icon
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

  // Ngăn scroll body khi menu mobile mở
  useEffect(() => {
    if (isMobile && showCategoryMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, showCategoryMenu]);

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

  const closeMobileMenu = () => {
    setShowCategoryMenu(false);
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
        onClick={isMobile ? toggleMenu : (!isHomePage ? toggleMenu : undefined)}
      >
        <Menu className={`w-5 h-5 ${isMobile ? 'text-white' : 'text-[#263B96]'}`} />
        {!isMobile && (
          <span className="ml-2 text-base font-bold">DANH MỤC SẢN PHẨM</span>
        )}
      </div>

      {categories.length > 0 && showCategoryMenu && (
        <>
          {/* Menu chính */}
          {!isMobile ? (
            <div
              className={`absolute left-0 mx-0 top-full bg-white shadow-xl w-62 z-50 overflow-hidden border border-gray-100 transition-transform duration-300`}
              onMouseLeave={handleMenuMouseLeave}
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
          ) : (
            /* Mobile Menu - Fixed modal với overlay */
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={closeMobileMenu}
              />

              {/* Menu container */}
              <div className="fixed top-0 left-0 right-0 h-screen bg-white z-50 overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#263B96]">DANH MỤC SẢN PHẨM</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Nội dung có thể cuộn */}
                <div className="h-[calc(100vh-60px)] overflow-y-auto">
                  {/* Hiển thị danh mục chính hoặc subcategory */}
                  {!activeCategory ? (
                    <div className="bg-white text-sm">
                      {displayedCategories.map((category) => (
                        <div
                          key={category._id}
                          onClick={(e) => handleCategoryClick(category, e)}
                        >
                          <div className={`flex items-center justify-between py-3 px-4 cursor-pointer transition-all duration-200 ${activeCategory && activeCategory._id === category._id
                            ? "bg-blue-50 text-[#C94669] border-l-4 border-[#263B96]"
                            : "hover:bg-gray-50"
                            }`}>
                            <span className="font-semibold">
                              {category.name}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}

                      {showAllCategories && (
                        <div>
                          <div
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
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
                            className="w-full px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center justify-between text-blue-600 font-medium border-t border-gray-100"
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
                    </div>
                  ) : (
                    /* Hiển thị subcategories trên mobile */
                    <div className="p-4">
                      {/* Nút back */}
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="flex items-center text-blue-600 font-medium mb-4"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
                        Quay lại danh mục
                      </button>

                      <h3 className="font-bold text-[#263B96] text-lg mb-4 pb-3 border-b">
                        {activeCategory.name}
                      </h3>

                      {activeCategory.brands && activeCategory.brands.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-700 mb-3 text-sm">
                            THƯƠNG HIỆU NỔI BẬT
                          </h4>
                          <div className="flex flex-col gap-3">
                            {activeCategory.brands.map((brand) => (
                              <Link
                                href={`/${activeCategory.slug}/${brand.slug}`}
                                key={brand._id}
                                onClick={closeMobileMenu}
                                className="text-sm text-gray-600 hover:text-[#263B96] py-2 px-3 rounded hover:bg-gray-50"
                              >
                                {brand.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3 text-sm">
                            PHÂN LOẠI SẢN PHẨM
                          </h4>
                          <div className="flex flex-col gap-3">
                            {activeCategory.subcategories.map((sub) => (
                              <Link
                                href={`/${activeCategory.slug}/${sub.slug}`}
                                key={sub._id}
                                onClick={closeMobileMenu}
                                className="text-sm text-gray-600 hover:text-[#263B96] py-2 px-3 rounded hover:bg-gray-50"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!activeCategory.brands || activeCategory.brands.length === 0) &&
                        (!activeCategory.subcategories || activeCategory.subcategories.length === 0) && (
                          <p className="text-gray-500 text-sm italic py-4">
                            Chưa có phân loại cho danh mục này
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Popup thông tin sản phẩm cho DESKTOP */}
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
        </>
      )}
    </div>
  );
}