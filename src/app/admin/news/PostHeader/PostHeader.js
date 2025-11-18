"use client";
import { useEffect, useState } from "react";
import { FaSearch, FaFileExport, FaPlus, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";

const PostHeader = ({
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  setItemsPerPage,
  handleExport,
  statusOptions,
  selectedStatus,
  setSelectedStatus,
  categoryOptions,
  selectedCategory,
  setSelectedCategory,
}) => {

  const [inputValue, setInputValue] = useState(searchTerm); 

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(inputValue); 
    }, 300);

    return () => clearTimeout(delayDebounce); 
  }, [inputValue]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value === "" ? "" : value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value === "" ? "" : value);
  };

  const router = useRouter();
  const handleAddClick = () => {
    router.push("/admin/add-news");
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm bài viết"
            className="pl-10 pr-4 py-2.5 rounded-lg w-80 transition-all"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>

        <div className="flex space-x-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all min-w-48"
              value={selectedStatus || ""}
              onChange={handleStatusChange}
            >
              {statusOptions?.map((sta) => (
                <option key={sta.value} value={sta.value}>
                  {sta.label}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all min-w-48"
              value={selectedCategory || ""}
              onChange={handleCategoryChange}
            >
              {categoryOptions?.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <div className="flex space-x-3">
          <select
            className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5 mục</option>
            <option value={7}>7 mục</option>
            <option value={10}>10 mục</option>
            <option value={15}>15 mục</option>
          </select>

          {/* <button
            className="flex items-center bg-white border rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-all"
            onClick={handleExport}
          >
            <FaFileExport className="mr-2" />
            <span>Xuất</span>
          </button> */}

          <button
            className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 transition-all"
            onClick={handleAddClick}
          >
            <FaPlus className="mr-2" />
            <span>Thêm bài viết</span>
          </button>
        </div>
      </div>

      {(selectedStatus || selectedCategory) && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            {selectedStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {statusOptions.find((sta) => sta.value === selectedStatus)?.label ||
                  "Trạng thái đã chọn"}
                <button
                  onClick={() => setSelectedStatus("")}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {categoryOptions.find((cat) => cat.value === selectedCategory)?.label ||
                  "Danh mục đã chọn"}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostHeader;
