"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Save,
  X,
  Search,
  Palette,
  Tag,
  Check,
} from "lucide-react";
import {
  getAllLabels,
  createLabel,
  updateLabel,
  deleteLabel,
} from "@/apiServices/label";
import LabelProducts from "./LabelProducts";

export default function LabelManager() {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    colorBg: "#3498db",
    colorText: "#ffffff",
    icon: "",
    specialBackground: "",
  });

  // Predefined colors
  const presetColors = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#e67e22",
    "#34495e",
    "#95a5a6",
    "#f1c40f",
    "#8e44ad",
    "#27ae60",
    "#c0392b",
    "#2980b9",
    "#d35400",
  ];

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setLoading(true);
      const data = await getAllLabels();
      if (data) {
        setLabels(data);
      }
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    try {
      setSubmitting(true);

      if (editingLabel) {
        const updated = await updateLabel(editingLabel._id, formData);
        if (updated) {
          setLabels(
            labels.map((label) =>
              label._id === editingLabel._id ? updated : label
            )
          );
        }
      } else {
        const newLabel = await createLabel(formData);
        if (newLabel) {
          setLabels([...labels, newLabel]);
        }
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save label:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (label) => {
    setEditingLabel(label);
    setFormData({
      name: label.name,
      colorBg: label.colorBg,
      colorText: label.colorText,
      icon: label.icon || "",
      specialBackground: label.specialBackground || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (labelId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhãn này?")) {
      const success = await deleteLabel(labelId);
      if (success) {
        setLabels(labels.filter((label) => label._id !== labelId));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      colorBg: "#3498db",
      colorText: "#ffffff",
      icon: "",
      specialBackground: "",
    });
    setEditingLabel(null);
    setShowForm(false);
  };

  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preview component
  const LabelPreview = ({ label }) => (
    <span
      className="text-xs mb-1 rounded-full px-3 py-1.5 font-medium"
      style={{
        backgroundColor: label.colorBg || "#f3f4f6",
        color: label.colorText || "#000000",
      }}
    >
      {label.name || "Tên nhãn"}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Tag className="w-7 h-7 text-blue-600" />
                Quản lý nhãn sản phẩm
              </h1>
              <p className="text-gray-600 mt-1">
                Tạo và quản lý các nhãn để phân loại sản phẩm
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Tạo nhãn mới
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm nhãn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          {showForm && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    {editingLabel ? "Chỉnh sửa nhãn" : "Tạo nhãn mới"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Label Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên nhãn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nhập tên nhãn"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu nền
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, colorBg: color })
                          }
                          className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform relative"
                          style={{ backgroundColor: color }}
                        >
                          {formData.colorBg === color && (
                            <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                    <input
                      type="color"
                      value={formData.colorBg}
                      onChange={(e) =>
                        setFormData({ ...formData, colorBg: e.target.value })
                      }
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu chữ
                    </label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, colorText: "#ffffff" })
                        }
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          formData.colorText === "#ffffff"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        Trắng
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, colorText: "#000000" })
                        }
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          formData.colorText === "#000000"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        Đen
                      </button>
                    </div>
                    <input
                      type="color"
                      value={formData.colorText}
                      onChange={(e) =>
                        setFormData({ ...formData, colorText: e.target.value })
                      }
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xem trước
                    </label>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Nhãn sẽ hiển thị như:
                        </span>
                      </div>
                      <div className="mt-3">
                        <LabelPreview label={formData} />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || !formData.name.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingLabel ? "Cập nhật nhãn" : "Tạo nhãn"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Labels List */}
          <div className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Danh sách nhãn ({filteredLabels.length})
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang tải...</p>
                </div>
              ) : filteredLabels.length > 0 ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredLabels.map((label) => (
                      <div
                        key={label._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <LabelPreview label={label} />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(label)}
                              className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(label._id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Tên:</span>
                            <span>{label.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Màu nền:</span>
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: label.colorBg }}
                            ></div>
                            <span className="text-xs">{label.colorBg}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Màu chữ:</span>
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: label.colorText }}
                            ></div>
                            <span className="text-xs">{label.colorText}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Chưa có nhãn nào
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Tạo nhãn đầu tiên để bắt đầu phân loại sản phẩm
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Tạo nhãn ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <LabelProducts />
    </div>
  );
}
