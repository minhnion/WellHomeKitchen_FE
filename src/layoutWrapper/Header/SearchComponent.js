"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { autoSearchProducts } from "@/apiServices/search";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";

const SearchComponent = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [defaultSuggestions, setDefaultSuggestions] = useState([]);

  // Fetch trending products on mount
  useEffect(() => {
    async function fetchDefaultSuggestions() {
      try {
        const data = await autoSearchProducts("");
        setDefaultSuggestions(data?.products || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchDefaultSuggestions();
  }, []);

  const handleFocus = () => {
    if (!searchTerm && defaultSuggestions.length > 0) {
      setSuggestions({ products: defaultSuggestions, categories: [] });
      setShowSuggestions(true);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchSuggestions = async (term) => {
    if (!term || term.trim() === "") {
      setSuggestions(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await autoSearchProducts(term);
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions(null);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useRef(
    debounce((term) => fetchSuggestions(term), 300)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
    debouncedFetchSuggestions(value);
  };

  const handleSubmit = (e) => {
    if (!searchTerm.trim()) {
      return; // để trình duyệt tự bật "Please fill out this field"
    }
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (!suggestions) return;
    const totalSuggestions =
      (suggestions.products?.length || 0) +
      (suggestions.categories?.length || 0);
    if (totalSuggestions === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < totalSuggestions - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : totalSuggestions - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(selectedIndex);
    }
  };

  const handleSuggestionSelect = (index) => {
    if (!suggestions) return;
    const productCount = suggestions.products?.length || 0;

    if (index < productCount) {
      const product = suggestions.products[index];
      router.push(`/san-pham/${product.slug}`);
    } else {
      const categoryIndex = index - productCount;
      const category = suggestions.categories[categoryIndex];
      router.push(`/${category.slug}`);
    }

    setSearchTerm("");
    setSuggestions(null);
    setShowSuggestions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full md:flex-1 flex justify-center" ref={searchRef}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-full md:max-w-[680px]"
      >
        <div className="relative flex items-center bg-white border border-gray-300 rounded-md shadow-sm h-[41px]">
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-3 sm:px-4 text-sm text-black placeholder-gray-400 rounded-l-md focus:outline-none focus:ring-0 focus:border-transparent h-full"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            required
          />

          {/* Clear button */}
          {/* {searchTerm && (
            <button
              type="button"
              className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setSearchTerm("");
                setSuggestions(null);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )} */}

          {/* Search button */}
          <button
            type="submit"
            className="flex items-center justify-center px-3 sm:px-4 bg-[#263B96] text-white rounded-r-md hover:bg-[#263B96] active:bg-[#263B96] transition-colors h-full"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 w-full md:max-w-[680px] mt-1 bg-white rounded-md shadow-md border border-gray-200 max-h-[70vh] overflow-y-auto left-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : searchTerm === "" ? (
              <div className="p-3 text-gray-700 text-sm font-medium">
                Gợi ý cho bạn:
              </div>
            ) : (!suggestions ||
              ((!suggestions.products || suggestions.products.length === 0) &&
                (!suggestions.categories || suggestions.categories.length === 0))) ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Không có sản phẩm nào...
              </div>
            ) : (
              <>
                {/* Products */}
                {suggestions.products?.length > 0 && (
                  <div className="p-2">
                    <h3 className="px-2 pb-1 text-xs font-semibold text-gray-500 uppercase">
                      Sản phẩm
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {suggestions.products.map((product, index) => (
                        <div
                          key={product._id}
                          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 transition ${selectedIndex === index ? "bg-blue-50" : ""
                            }`}
                          onClick={() => handleSuggestionSelect(index)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3">
                            {product.mainImage ? (
                              <Image
                                src={`${API_BASE_URL}${product.mainImage}`}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex justify-center items-center text-gray-400">
                                <Search className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            {product.discountPercent > 0 && (
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(product.price)}
                              </p>
                            )}
                            <p className="text-sm text-blue-600 font-semibold">
                              {formatPrice(
                                product.price -
                                (product.price *
                                  (product.discountPercent || 0)) /
                                100
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                {suggestions.categories?.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="px-2 pb-1 text-xs font-semibold text-gray-500 uppercase">
                      Danh mục
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {suggestions.categories.map((category, index) => (
                        <div
                          key={category._id}
                          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 transition ${selectedIndex ===
                            suggestions.products.length + index
                            ? "bg-blue-50"
                            : ""
                            }`}
                          onClick={() =>
                            handleSuggestionSelect(
                              suggestions.products.length + index
                            )
                          }
                        >
                          {/* <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden mr-3">
                            {category.imageUrl ? (
                              <Image
                                src={`${API_BASE_URL}${category.imageUrl}`}
                                alt={category.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex justify-center items-center text-gray-400">
                                <Search className="w-4 h-4" />
                              </div>
                            )}
                          </div> */}
                          <p className="text-sm font-medium text-gray-800">
                            {category.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View all */}
                <div className="px-4 py-3 bg-gray-50 border-t">
                  <Link
                    href={`/tim-kiem?q=${encodeURIComponent(searchTerm)}`}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-center"
                    onClick={() => setShowSuggestions(false)}
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Xem tất cả kết quả cho "{searchTerm}"
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchComponent;
