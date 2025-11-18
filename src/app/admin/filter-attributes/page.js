"use client";

import { getAllCategories } from "@/apiServices/categories";
import {
  createFilterAttriBute,
  deleteFilterAttriBute,
  getFilterAttriButes,
  updateFilterAttriBute,
} from "@/apiServices/filterAttribute";
import { MdAdd, MdSave } from "react-icons/md";
import { useEffect, useState } from "react";
import AttributesList from "./AttributesList/AttributesList";
import { toast } from "react-toastify";

export default function FilterAttributesManager() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [newAttributeKey, setNewAttributeKey] = useState("");
  const [newAttributeValues, setNewAttributeValues] = useState("");

  const TEMP_ID_PREFIX = "temp_";
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchAllFilterData = async () => {
      try {
        const response = await getFilterAttriButes();
        setFilterData(response || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchCategories();
    fetchAllFilterData();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const found = filterData.find((f) => f.categoryId === selectedCategoryId);
      setCurrentFilter(found || null);
    } else {
      setCurrentFilter(null);
    }
  }, [selectedCategoryId, filterData]);

  const handleAddAttribute = () => {
    if (!newAttributeKey.trim() || !newAttributeValues.trim()) return;

    const values = newAttributeValues
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    const newAttribute = {
      key: newAttributeKey.trim(),
      values: values,
      _id: `${TEMP_ID_PREFIX}attr_${Date.now().toString()}`, // Temporary ID for new attribute
    };

    if (currentFilter) {
      const updatedFilter = {
        ...currentFilter,
        attributes: [...currentFilter.attributes, newAttribute],
      };
      setCurrentFilter(updatedFilter);
      setFilterData((prev) =>
        prev.map((f) =>
          f.categoryId === selectedCategoryId ? updatedFilter : f
        )
      );
    } else {
      const newFilter = {
        _id: `${TEMP_ID_PREFIX}filter_${Date.now().toString()}`,
        categoryId: selectedCategoryId,
        attributes: [newAttribute],
      };
      setCurrentFilter(newFilter);
      setFilterData((prev) => [...prev, newFilter]);
    }

    setNewAttributeKey("");
    setNewAttributeValues("");
  };

  const handleSaveChanges = async () => {
    if (!currentFilter || !selectedCategoryId) return;
    try {
      const attributesToSave = currentFilter.attributes.map((attr) => ({
        key: attr.key,
        values: attr.values,
      }));

      const payload = {
        categoryId: selectedCategoryId,
        attributes: attributesToSave,
      };
      let savedFilterData;

      if (currentFilter._id && currentFilter._id.startsWith(TEMP_ID_PREFIX)) {
        savedFilterData = await createFilterAttriBute(payload);

        if (savedFilterData.success) {
          setFilterData((prev) => [
            ...prev.filter((f) => f._id !== currentFilter._id),
            savedFilterData.data,
          ]);
          setCurrentFilter(savedFilterData.data);
          toast.success(savedFilterData.message || "Tạo bộ lọc thành công!");
        }
      } else if (currentFilter._id) {
        if (currentFilter.attributes.length === 0) {
          const response = await deleteFilterAttriBute(selectedCategoryId);
          if (response.success) {
            setFilterData((prev) =>
              prev.filter((f) => f._id !== currentFilter._id)
            );
            setCurrentFilter(null);
            toast.success(response.message || "Xóa bộ lọc thành công!");
          }
        } else {
          savedFilterData = await updateFilterAttriBute(
            selectedCategoryId,
            payload
          );
          if (savedFilterData.success) {
            setFilterData((prev) =>
              prev.map((f) =>
                f._id === savedFilterData._id ? savedFilterData : f
              )
            );
            setCurrentFilter(savedFilterData);
            toast.success(
              savedFilterData.message || "Cập nhật bộ lọc thành công!"
            );
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  };

  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);

  return (
    <div className="mx-auto p-6 bg-gray-50 shadow-md">
      <div className="bg-white rounded-lg shadow-md border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Bộ lọc thuộc tính
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý các thuộc tính bộ lọc cho từng danh mục sản phẩm
          </p>
        </div>

        <div className="p-6">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn danh mục
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value=""> Chọn danh mục </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategoryId && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Bộ lọc cho: {selectedCategory?.name}
                </h2>
                <div className="text-sm text-gray-500">
                  {currentFilter?.attributes?.length || 0} thuộc tính
                </div>
              </div>

              {/* Add New Attribute */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-3">
                  Thêm thuộc tính mới
                </h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Tên thuộc tính (ví dụ: Xuất xứ, Màu sắc...)"
                      value={newAttributeKey}
                      onChange={(e) => setNewAttributeKey(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Các giá trị (phân cách bằng dấu phẩy) ví dụ: Việt Nam, Trung Quốc, Nhật Bản"
                      value={newAttributeValues}
                      onChange={(e) => setNewAttributeValues(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddAttribute}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MdAdd size={16} />
                    Thêm thuộc tính
                  </button>
                </div>
              </div>

              {/* Attributes List - Now as separate component */}
              <AttributesList
                currentFilter={currentFilter}
                selectedCategoryId={selectedCategoryId}
                setFilterData={setFilterData}
                setCurrentFilter={setCurrentFilter}
              />

              {/* Save Changes Button */}
              {currentFilter && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveChanges}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <MdSave size={16} />
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          )}

          {!selectedCategoryId && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-400 mb-4">
                <MdAdd size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Chọn danh mục để bắt đầu
              </h3>
              <p className="text-gray-500">
                Chọn một danh mục từ dropdown phía trên để quản lý các thuộc
                tính bộ lọc
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
