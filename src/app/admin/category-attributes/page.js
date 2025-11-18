"use client";

import { getAllCategories } from "@/apiServices/categories";
import {
  createCategoryAttribute,
  deleteCategoryAttribute,
  getCategoryAttributes,
  updateCategoryAttribute,
} from "@/apiServices/categoryAttribute";
import { MdAdd, MdSave } from "react-icons/md";
import { useEffect, useState } from "react";
import AttributesList from "./AttributesList/AttributesList";
import { toast } from "react-toastify";

export default function CategoryAttributesManager() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryAttrData, setCategoryAttrData] = useState([]);
  const [currentCategoryAttr, setCurrentCategoryAttr] = useState(null);
  const [newAttribute, setNewAttribute] = useState("");

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

    const fetchAllCategoryAttributes = async () => {
      try {
        const response = await getCategoryAttributes();
        setCategoryAttrData(response || []);
      } catch (error) {
        console.error("Error fetching category attributes:", error);
      }
    };

    fetchCategories();
    fetchAllCategoryAttributes();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const found = categoryAttrData.find(
        (attr) => attr.categoryId === selectedCategoryId
      );
      setCurrentCategoryAttr(found || null);
    } else {
      setCurrentCategoryAttr(null);
    }
  }, [selectedCategoryId, categoryAttrData]);

  const handleAddAttribute = () => {
    if (!newAttribute.trim()) return;

    const attributeToAdd = newAttribute.trim();

    if (
      currentCategoryAttr?.attributes.some(
        (attr) => attr.toLowerCase() === attributeToAdd.toLowerCase()
      )
    ) {
      toast.warn("Thuộc tính này đã tồn tại!");
      return;
    }

    if (currentCategoryAttr) {
      const updatedAttr = {
        ...currentCategoryAttr,
        attributes: [...currentCategoryAttr.attributes, attributeToAdd],
      };
      setCurrentCategoryAttr(updatedAttr);
      setCategoryAttrData((prev) =>
        prev.map((a) => (a.categoryId === selectedCategoryId ? updatedAttr : a))
      );
    } else {
      const newAttrSet = {
        _id: `${TEMP_ID_PREFIX}attr_${Date.now().toString()}`,
        categoryId: selectedCategoryId,
        attributes: [attributeToAdd],
      };
      setCurrentCategoryAttr(newAttrSet);
      setCategoryAttrData((prev) => [...prev, newAttrSet]);
    }

    setNewAttribute("");
  };

  const handleSaveChanges = async () => {
    if (!currentCategoryAttr || !selectedCategoryId) return;
    try {
      const payload = {
        categoryId: selectedCategoryId,
        attributes: currentCategoryAttr.attributes,
      };
      let savedData;

      if (currentCategoryAttr._id.startsWith(TEMP_ID_PREFIX)) {
        savedData = await createCategoryAttribute(payload);
        if (savedData.success) {
          setCategoryAttrData((prev) => [
            ...prev.filter((a) => a._id !== currentCategoryAttr._id),
            savedData.data,
          ]);
          setCurrentCategoryAttr(savedData.data);
          toast.success(savedData.message || "Tạo bộ thuộc tính thành công!");
        }
      } else {
        if (currentCategoryAttr.attributes.length === 0) {
          const response = await deleteCategoryAttribute(selectedCategoryId);
          if (response.success) {
            setCategoryAttrData((prev) =>
              prev.filter((a) => a._id !== currentCategoryAttr._id)
            );
            setCurrentCategoryAttr(null);
            toast.success(response.message || "Xóa bộ thuộc tính thành công!");
          }
        } else {
          savedData = await updateCategoryAttribute(
            selectedCategoryId,
            payload
          );
          if (savedData.success) {
            setCategoryAttrData((prev) =>
              prev.map((a) => (a._id === savedData._id ? savedData : a))
            );
            setCurrentCategoryAttr(savedData);
            toast.success(
              savedData.message || "Cập nhật thuộc tính thành công!"
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
            Quản lý Thuộc tính Danh mục
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý các thuộc tính cơ bản cho từng danh mục sản phẩm
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn danh mục
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategoryId && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Thuộc tính cho: {selectedCategory?.name}
                </h2>
                <div className="text-sm text-gray-500">
                  {currentCategoryAttr?.attributes?.length || 0} thuộc tính
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-900 mb-3">
                  Thêm thuộc tính mới
                </h3>
                <div className="flex items-end gap-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Tên thuộc tính (ví dụ: Xuất sứ, Màu sắc...)"
                      value={newAttribute}
                      onChange={(e) => setNewAttribute(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddAttribute()
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAddAttribute}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 flex-shrink-0"
                  >
                    <MdAdd size={16} />
                    Thêm
                  </button>
                </div>
              </div>

              <AttributesList
                currentCategoryAttr={currentCategoryAttr}
                setCurrentCategoryAttr={setCurrentCategoryAttr}
                setCategoryAttrData={setCategoryAttrData}
                selectedCategoryId={selectedCategoryId}
              />

              {currentCategoryAttr && (
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
                tính
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
