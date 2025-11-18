"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchProducts } from "@/apiServices/search";
import { Search, Filter as FilterIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [sortPrice, setSortPrice] = useState(null);
  const [sortNew, setSortNew] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const handleSortPrice = (value) => {
    setSortPrice(value);
    setCurrentPage(1);
  };

  const handleSortNew = (value) => {
    setSortNew(value);
    setCurrentPage(1);
  };

  const handleSortReset = () => {
    setSortPrice(null);
    setSortNew(null);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await searchProducts(
          query,
          currentPage,
          20,
          sortPrice ? sortPrice : null,
          sortNew ? sortNew : null
        );
        if (response && response.success) {
          setProducts(response.data || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setTotalResults(response.pagination?.totalProducts || 0);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, currentPage, sortPrice, sortNew]);

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return (
    <main className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Kết quả tìm kiếm</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Search Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Search className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Kết quả tìm kiếm
              </h1>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <span className="font-medium">Từ khóa:</span>
                <span className="ml-2 px-3 py-1 bg-blue-100 rounded-full text-sm font-medium">
                  "{query}"
                </span>
              </p>
              {!loading && (
                <p className="text-blue-700 text-sm mt-2">
                  Tìm thấy <span className="font-bold">{totalResults}</span> sản
                  phẩm
                </p>
              )}
            </div>
          </div>

          {/* Filter Bar (if needed in future) */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-medium text-gray-800">
                {loading ? "Đang tìm kiếm..." : `${totalResults} sản phẩm`}
              </div>

              {/* Optional: Add sort options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "price-asc" || value === "price-desc") {
                      handleSortPrice(value);
                      setSortNew(null);
                    } else if (value === "newest" || value === "oldest") {
                      handleSortNew(value);
                      setSortPrice(null);
                    } else {
                      setSortPrice(null);
                      setSortNew(null);
                    }
                  }}
                  value={sortPrice || sortNew || ""}
                >
                  <option value="">Mặc định</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">
                Đang tìm kiếm sản phẩm...
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    {...product}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isLoading={loading}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="py-16">
              <div className="text-center max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Không tìm thấy sản phẩm nào
                </h2>

                <p className="text-gray-600 mb-6">
                  Không tìm thấy sản phẩm phù hợp với từ khóa
                  <span className="font-medium text-gray-800"> "{query}"</span>
                </p>

                {/* Suggestions Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <FilterIcon className="w-5 h-5 mr-2" />
                    Gợi ý tìm kiếm:
                  </h3>

                  <ul className="text-blue-700 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Kiểm tra lại chính tả từ khóa
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Sử dụng từ khóa ngắn gọn và tổng quát hơn
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Thử tìm kiếm với từ đồng nghĩa
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Xem tất cả sản phẩm trong{" "}
                      <Link
                        href="/tim-kiem?q="
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline ml-1"
                      >
                        danh mục sản phẩm
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link
                    href="/tim-kiem?q="
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Xem tất cả sản phẩm
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Categories or Popular Products (Optional) */}
        {!loading && products.length === 0 && query && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh mục phổ biến
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Tủ lạnh", href: "/tu-lanh" },
                { name: "Hút mùi", href: "/hut-mui" },
                { name: "Máy rửa bát", href: "/may-rua-bat" },
                { name: "Bếp từ", href: "/bep-tu" },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition-colors border border-gray-200 hover:border-gray-300"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải...</p>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
