"use client";
import React, { useState, useEffect } from "react";
import { getPostCategories } from "@/apiServices/postCategory";
import { toast } from "react-toastify";

const CategorySelect = ({ formFields, onChangeFormFields }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPostCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          toast.error("Lỗi tải danh mục");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Lỗi tải danh mục");
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    onChangeFormFields({ ...formFields, postCategory: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chọn danh mục (*)
          </label>
          <select
            name="postCategory"
            value={formFields.postCategory || ""}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
