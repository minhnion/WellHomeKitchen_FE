"use client";
import { use, useEffect, useState } from "react";
import { FaSearch, FaFileExport, FaPlus, FaFilter } from "react-icons/fa";
import CreateModal from "@/components/CreateModal/CreateModal";

const SubCategoryHeader = ({
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  setItemsPerPage,
  handleExport,
  handleAddSubCategory,
  subcategoryFields,
  categories,
  categoryId,
  setCategoryId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryId(value === "" ? null : value);
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm phân loại"
            className="pl-10 pr-4 py-2.5 rounded-lg w-80 transition-all"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all min-w-48"
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
          <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
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
            onClick={openModal}
          >
            <FaPlus className="mr-2" />
            <span>Thêm Phân Loại</span>
          </button>
        </div>
      </div>

      {categoryId && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {categories.find((cat) => cat._id === categoryId)?.name ||
                "Danh mục đã chọn"}
              <button
                onClick={() => setCategoryId(null)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Modal Create */}
      <CreateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAddSubCategory}
        title="Thêm Phân Loại Danh Mục Mới"
        fields={subcategoryFields}
      />
    </>
  );
};

export default SubCategoryHeader;
