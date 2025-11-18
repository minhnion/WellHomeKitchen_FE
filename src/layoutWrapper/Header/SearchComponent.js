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

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Fetch suggestions
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

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useRef(
    debounce((term) => fetchSuggestions(term), 300)
  ).current;

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);
    debouncedFetchSuggestions(value);
  };

  // Handle search form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions) return;

    const totalSuggestions =
      (suggestions.products?.length || 0) +
      (suggestions.categories?.length || 0);

    if (totalSuggestions === 0) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < totalSuggestions - 1 ? prevIndex + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : totalSuggestions - 1
      );
    }
    // Enter
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(selectedIndex);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (index) => {
    if (!suggestions) return;

    const productCount = suggestions.products?.length || 0;

    if (index < productCount) {
      // Product selection
      const product = suggestions.products[index];
      router.push(`/san-pham/${product.slug}`);
    } else {
      // Category selection
      const categoryIndex = index - productCount;
      const category = suggestions.categories[categoryIndex];
      router.push(`/${category.slug}`);
    }

    setSearchTerm("");
    setSuggestions(null);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full md:flex-1 flex justify-center mb-0" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Bạn tìm gì ?"
          className="w-full pl-10 pr-10 py-2.5 bg-white text-black border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions) setShowSuggestions(true);
          }}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSearchTerm("");
              setSuggestions(null);
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {showSuggestions && searchTerm && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : !suggestions ||
              ((!suggestions.products || suggestions.products.length === 0) &&
                (!suggestions.categories ||
                  suggestions.categories.length === 0)) ? (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy kết quả phù hợp
              </div>
            ) : (
              <>
                {suggestions.products && suggestions.products.length > 0 && (
                  <div className="p-2">
                    <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase">
                      Sản phẩm
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {suggestions.products.map((product, index) => (
                        <div
                          key={product._id}
                          className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                            selectedIndex === index ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleSuggestionSelect(index)}
                        >
                          <div className="flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                            {product.mainImage ? (
                              <Image
                                src={`${API_BASE_URL}${product.mainImage}`}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="object-cover w-16 h-16"
                                style={{ minHeight: "64px" }}
                              />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center text-gray-400 bg-gray-100">
                                <Search className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <p className="text-sm font-medium text-gray-900 leading-5 mb-1">
                              {product.name}
                            </p>
                            {product.discountPercent > 0 && (
                              <p className="text-sm text-gray-500 line-through">
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

                {suggestions.categories &&
                  suggestions.categories.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase">
                        Danh mục
                      </h3>
                      <div className="divide-y divide-gray-100">
                        {suggestions.categories.map((category, index) => (
                          <div
                            key={category._id}
                            className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                              selectedIndex ===
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
                            <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden mr-3">
                              {category.imageUrl ? (
                                <Image
                                  src={`${API_BASE_URL}${category.imageUrl}`}
                                  alt={category.name}
                                  width={32}
                                  height={32}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                  <Search className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                              {category.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="px-4 py-3 bg-gray-50 border-t">
                  <Link
                    href={`/tim-kiem?q=${encodeURIComponent(searchTerm)}`}
                    className="text-sm text-blue-600 font-medium hover:underline flex items-center justify-center transition-colors duration-150"
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
