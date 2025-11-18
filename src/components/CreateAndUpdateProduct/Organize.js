"use client";
import React from "react";

const Organize = ({
  formFields,
  onChangeFormFields,
  categoryOptions = [],
  subCategoryOptions = [],
  brandOptions = [],
  onCategoryChange,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "category") {
      onCategoryChange(newValue);
    } else {
      onChangeFormFields({ ...formFields, [name]: newValue });
    }
  };

  const isCategorySelected = formFields.category && formFields.category !== "";

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tổ chức sản phẩm
      </h3>
      <div className="space-y-4">
        {/* Category Select */}
        <div>
          <select
            name="category"
            value={formFields.category || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
          >
            <option value="" className="text-gray-400">
              Danh mục (*)
            </option>
            {categoryOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* SubCategory Select */}
        <div>
          <select
            name="subCategory"
            value={formFields.subCategory || ""}
            onChange={handleInputChange}
            disabled={!isCategorySelected}
            className={`w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              !isCategorySelected
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-gray-700"
            }`}
          >
            <option value="" className="text-gray-400">
              {!isCategorySelected
                ? "Chọn danh mục trước (*)"
                : "Phân loại (*)"}
            </option>
            {isCategorySelected &&
              subCategoryOptions.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
          </select>
        </div>

        {/* Brand Select */}
        <div>
          <select
            name="brand"
            value={formFields.brand || ""}
            onChange={handleInputChange}
            disabled={!isCategorySelected}
            className={`w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              !isCategorySelected
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-gray-700"
            }`}
          >
            <option value="" className="text-gray-400">
              {!isCategorySelected
                ? "Chọn danh mục trước (*)"
                : "Thương hiệu (*)"}
            </option>
            {isCategorySelected &&
              brandOptions.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
          </select>
        </div>

        <div className="pt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isSpecial"
              checked={!!formFields.isSpecial}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">
              Sản phẩm đặc biệt
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Organize;
