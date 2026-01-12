"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { FaArrowRight } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";
import Link from "next/link";
import Image from "next/image";

export default function CategoryProducts({
  banner = null,
  categories = [],
  categoriesWithProducts = [],
  isExtend = false,
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?._id);

  const activeCategoryWithProducts =
    categoriesWithProducts.find(
      (item) => item.category?._id === activeCategory
    ) ||
    categoriesWithProducts.find(
      (item) => item.category?._id === categories[0]?._id
    ) ||
    categoriesWithProducts[0];

  const products = activeCategoryWithProducts?.products || [];
  const activeCategoryName = activeCategoryWithProducts?.category?.name || "";
  const [isTouched, setIsTouched] = useState(false);

  return (
    <div className="w-full ">
      {/* Category Navigation */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 py-3">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setActiveCategory(category._id)}
            className={`py-1.5 text-xs sm:text-sm border rounded-md transition
              ${activeCategory === category._id
                ? "bg-blue-700 text-white border-blue-700"
                : "bg-white text-gray-600 border-gray-300 hover:text-blue-500 hover:border-blue-400"
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products + Banner */}
      <div className="mt-4 ">
        {products.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-2 items-stretch">
            {/* Banner LEFT */}
            {banner && (
              <div className="hidden lg:block lg:w-1/5 self-stretch">
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <Image
                    src={new URL(banner.url, API_BASE_URL).href}
                    alt="Category banner"
                    fill
                    className="object-fill"
                    quality={100}
                  />
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className={banner ? "lg:w-5/6 w-full" : "w-full"}>
              <div
                className="
                  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-2 gap-y-3 sm:gap-3 mb-6 max-sm:mb-4
                "
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    fluid
                    {...product}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}
      </div>

      {/* Extend link */}
      {isExtend && products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${activeCategoryWithProducts.category.slug}`}
            onTouchStart={() => setIsTouched(true)}
            onTouchEnd={() => setTimeout(() => setIsTouched(false), 300)}
            className={`
        relative overflow-hidden
        inline-flex items-center px-5 py-2.5
        border border-black
        text-black
        bg-white
        rounded-lg
        transition-colors duration-300
        group
      `}
          >
            {/* Background trượt */}
            <span
              className={`
          absolute inset-0
          bg-red-600
          -translate-x-full
          transition-transform duration-300 ease-out
          group-hover:translate-x-0
          ${isTouched ? "translate-x-0" : ""}
        `}
            />

            {/* Text */}
            <span
              className={`
          relative z-10 flex items-center gap-2
          transition-colors duration-300
          group-hover:text-white
          ${isTouched ? "text-white" : ""}
        `}
            >
              Xem tất cả {activeCategoryName.toLowerCase()}
            </span>
          </Link>
        </div>
      )}


    </div>
  );
}
