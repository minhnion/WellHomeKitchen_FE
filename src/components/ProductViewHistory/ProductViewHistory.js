"use client";

import { X, Trash2 } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  clearProductViewHistory,
  getProductViewHistory,
  removeProductFromViewHistory,
} from "@/utils/productViewHistoryUtils";
import { getProductsById } from "@/apiServices/products";

export default function ProductViewHistory() {
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingIds, setRemovingIds] = useState(new Set());

  useEffect(() => {
    const productViewHistory = getProductViewHistory();
    const ids = productViewHistory || [];
    setProductIds(ids);
    setIsLoading(false);

    if (ids.length > 0) {
      const fetchProducts = async () => {
        try {
          const productPromises = ids.map((id) => getProductsById(id));
          const productsData = await Promise.all(productPromises);
          setProducts(productsData.filter(Boolean));
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    }
  }, []);

  const deleteAllProducts = () => {
    setProductIds([]);
    setProducts([]);
    clearProductViewHistory();
  };

  const handleDelete = (id) => {
    // Add to removing set for animation
    setRemovingIds(new Set(removingIds.add(id)));

    // Remove after animation completes
    setTimeout(() => {
      setProductIds((prev) => prev.filter((productId) => productId !== id));
      setProducts((prev) => prev.filter((product) => product._id !== id));
      removeProductFromViewHistory(id);
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  if (isLoading) {
    return null;
  }

  if (productIds.length === 0) {
    return <></>;
  }

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="w-full my-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Sản phẩm đã xem</h3>
        <button
          onClick={deleteAllProducts}
          className="text-gray-500 hover:text-red-500 flex items-center text-sm transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Xoá lịch sử
        </button>
      </div>

      <div className="pb-4 px-4 relative">
        <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory pb-2 hide-scrollbar">
          {products.map((product) => (
            <div
              key={product._id}
              className={`relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
                removingIds.has(product._id)
                  ? "opacity-0 scale-95"
                  : "opacity-100 scale-100"
              } hover:shadow-md flex-shrink-0 w-[calc(25%-9px)] snap-start max-md:w-[49%] max-sm:w-[100%]`}
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(product._id)}
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full p-1 transition-colors backdrop-blur-sm"
                aria-label="Remove product"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Product image and info (clickable) */}
              <Link
                href={`/san-pham/${product.slug}`}
                className="flex items-center p-2"
              >
                <div className="relative w-16 h-16 flex-shrink-0 mr-2">
                  <Image
                    src={`${API_BASE_URL}${product.mainImage}`}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h4
                    className="text-xs font-medium text-gray-800 line-clamp-2"
                    title={product.name}
                  >
                    {product.name}
                  </h4>

                  <div className="mt-1">
                    <span className="text-sm text-red-600 font-bold">
                      {formatPrice(
                        product.price -
                          (product.price * (product.discountPercent || 0)) /
                            100
                      )}
                      <span className="underline">đ</span>
                    </span>

                    {/* Discount price */}
                    {product.discountPercent > 0 && (
                      <span className="text-xs text-gray-500 line-through block">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
