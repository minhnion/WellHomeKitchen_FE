"use client";
import { getAllProducts } from "@/apiServices/products";
import Pagination from "@/components/Pagination/Pagination";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SpecialProductsClient({
  initialProducts,
  initialCurrentPage,
  initialTotalPages,
  initialTotalProducts,
  limit,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalProducts, setTotalProducts] = useState(initialTotalProducts);
  const [specialProducts, setSpecialProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (newPage) => {
    if (newPage === currentPage) return;

    setLoading(true);
    setCurrentPage(newPage);

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });

    try {
      const response = await getAllProducts(
        newPage,
        limit,
        null,
        null,
        null,
        null,
        true
      );
      setSpecialProducts(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalProducts(response.pagination.totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tổng số sản phẩm */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Tổng số: {totalProducts} sản phẩm
        </h2>
      </div>

      {/* Danh sách sản phẩm đặc biệt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-2"></div>
              <div className="bg-gray-300 h-4 rounded mb-1"></div>
              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            </div>
          ))
        ) : specialProducts && specialProducts.length > 0 ? (
          specialProducts.map((p) => <ProductCard key={p._id} id={p._id} {...p} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Không tìm thấy sản phẩm nào.
          </p>
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      )}
    </>
  );
}
