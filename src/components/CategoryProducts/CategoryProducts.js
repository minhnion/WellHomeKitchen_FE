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

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

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

  return (
    <div>
      <div className="w-full mb-1 bg-white border border-gray-200 rounded-xl pb-8 overflow-hidden">
        {/* Banner or not */}
        {banner && (
          <div className="relative w-full min-h-[100px] md:aspect-[15/4]">
            <Image
              src={new URL(banner.url, API_BASE_URL).href}
              alt="Banner for categoryProduct"
              fill
              quality={100}
              className="object-cover"
            />
          </div>
        )}

        {/* Category Navigation - Grid layout */}
        <div className="w-full border-b border-gray-200 px-2">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 py-3">
            {categories.map((category) => (
              <button
                key={category._id}
                className={`py-1.5 text-xs sm:text-sm font-medium transition whitespace-nowrap border rounded-md flex items-center justify-center ${
                  activeCategory === category._id
                    ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold"
                    : "border-gray-200 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                }`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-4 px-2 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product._id} id={product._id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>Không có sản phẩm nào trong danh mục này.</p>
            </div>
          )}
        </div>

        {/* Extend link */}

        {isExtend && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${activeCategoryWithProducts.category.slug}`}
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-blue-600 bg-white rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-medium text-xs sm:text-sm shadow-sm"
            >
              Xem thêm {activeCategoryName.toLowerCase()}
              <FaArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
