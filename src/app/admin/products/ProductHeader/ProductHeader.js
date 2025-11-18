"use client";
import { FaSearch, FaFileExport, FaPlus, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProductHeader = ({
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  setItemsPerPage,
  handleExport,
  categories,
  categoryId,
  setCategoryId,
  subcategories,
  subcategoryId,
  setSubCategoryId,
  brands,
  brandId,
  setBrandId,
}) => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState(searchTerm);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryId(value === "" ? null : value);
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setSubCategoryId(value === "" ? null : value);
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setBrandId(value === "" ? null : value);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm"
            className="pl-8 pr-3 py-1.5 rounded-lg w-64 text-sm transition-all border"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <FaSearch className="absolute left-2 top-2 text-gray-400 text-sm" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            className="pl-8 pr-6 py-1.5 rounded-lg border border-gray-300 text-sm transition-all w-40"
            value={categoryId || ""}
            onChange={handleCategoryChange}
          >
            <option value="">Danh mục</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <FaFilter className="absolute left-2 top-2 text-gray-400 text-sm" />
        </div>

        {/* SubCategory Filter */}
        <div className="relative">
          <select
            className="pl-8 pr-6 py-1.5 rounded-lg border border-gray-300 text-sm transition-all w-40"
            value={subcategoryId || ""}
            onChange={handleSubCategoryChange}
          >
            <option value="">Phân loại</option>
            {subcategories?.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          <FaFilter className="absolute left-2 top-2 text-gray-400 text-sm" />
        </div>

        {/* Brand Filter */}
        <div className="relative">
          <select
            className="pl-8 pr-6 py-1.5 rounded-lg border border-gray-300 text-sm transition-all w-40"
            value={brandId || ""}
            onChange={handleBrandChange}
          >
            <option value="">Thương hiệu</option>
            {brands?.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
          <FaFilter className="absolute left-2 top-2 text-gray-400 text-sm" />
        </div>

        <div className="flex space-x-2">
          <select
            className="border rounded-lg px-3 py-1.5 text-sm transition-all"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 /trang</option>
          </select>

          {/* <button
            className="flex items-center bg-white border rounded-lg px-3 py-1.5 text-sm transition-all"
            onClick={handleExport}
          >
            <FaFileExport className="mr-1 text-sm" />
            <span>Xuất</span>
          </button> */}

          <button
            className="flex items-center bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm transition-all"
            onClick={() => {
              router.push("/admin/add-product");
            }}
          >
            <FaPlus className="mr-1 text-sm" />
            <span>Thêm SẢN PHẨM</span>
          </button>
        </div>
      </div>

      {(categoryId || subcategoryId || brandId) && (
        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          <span className="text-gray-600">Bộ lọc đang áp dụng:</span>
          {categoryId && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {categories.find((c) => c._id === categoryId)?.name || "Danh mục"}
              <button
                onClick={() => setCategoryId(null)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {subcategoryId && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {subcategories.find((s) => s._id === subcategoryId)?.name ||
                "Phân loại"}
              <button
                onClick={() => setSubCategoryId(null)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
              >
                ×
              </button>
            </span>
          )}
          {brandId && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {brands.find((b) => b._id === brandId)?.name || "Thương hiệu"}
              <button
                onClick={() => setBrandId(null)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default ProductHeader;
