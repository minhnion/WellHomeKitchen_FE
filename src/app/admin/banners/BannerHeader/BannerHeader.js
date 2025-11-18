"use client";
import { useEffect, useState } from "react";
import { FaSearch, FaFileExport, FaPlus, FaFilter } from "react-icons/fa";
import CreateModal from "@/components/CreateModal/CreateModal";

const BannerHeader = ({
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  setItemsPerPage,
  handleExport,
  handleAdd,
  fields,
  typeOptions,
  typeSelect,
  setTypeSelect,
  isShowOptions,
  isShowSelect,
  setIsShowSelect,
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

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setTypeSelect(value === "" ? null : value);
  };

  const handleIsShowChange = (e) => {
    const value = e.target.value;
    setIsShowSelect(value === "" ? null : value);
  };
  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm Banner"
            className="pl-10 pr-4 py-2.5 rounded-lg w-80 transition-all"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>
        {/* Type Filter */}
        <div className="relative">
          <select
            className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all min-w-48"
            value={typeSelect || ""}
            onChange={handleTypeChange}
          >
            <option value="">Phân loại</option>
            {typeOptions?.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
        </div>
        {/* IsShow Filter */}
        <div className="relative">
          <select
            className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all min-w-48"
            value={isShowSelect || ""}
            onChange={handleIsShowChange}
          >
            <option value="">Trạng thái</option>
            {isShowOptions?.map((isShow) => (
              <option key={isShow.value} value={isShow.value}>
                {isShow.label}
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
            <span>Thêm Banner</span>
          </button>
        </div>
      </div>

      {/* Modal Create */}
      <CreateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAdd}
        title="Thêm Banner Mới"
        fields={fields}
      />
    </>
  );
};

export default BannerHeader;
