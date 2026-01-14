"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  X,
  Package,
  ShoppingCart,
  Filter,
  ChevronDown,
  Trash2,
  Edit3,
  AlertCircle,
} from "lucide-react";
import {
  getAllLabels,
  getProductsByLabel,
  addLabelToProduct,
  removeLabelFromProduct,
} from "@/apiServices/label";
import { getAllProducts } from "@/apiServices/products";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/apiServices/constants";

export default function LabelProducts() {
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [labelProducts, setLabelProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Loading states
  const [loadingLabels, setLoadingLabels] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // UI states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showLabelProducts, setShowLabelProducts] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState(null);
  const [productPagination, setProductPagination] = useState(null);

  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    if (selectedLabel) {
      fetchProductsByLabel();
    }
  }, [selectedLabel]);

  useEffect(() => {
    if (showProductModal) {
      fetchAllProducts();
    }
  }, [showProductModal, productSearchTerm]);

  const fetchLabels = async () => {
    try {
      setLoadingLabels(true);
      const data = await getAllLabels();
      if (data) {
        setLabels(data);
      }
    } catch (error) {
      console.error("Failed to fetch labels:", error);
    } finally {
      setLoadingLabels(false);
    }
  };

  const fetchProductsByLabel = async (page = 1) => {
    if (!selectedLabel) return;

    try {
      setLoadingProducts(true);
      const data = await getProductsByLabel(selectedLabel._id, page, 12);
      if (data) {
        setLabelProducts(data.data || []);
        setPagination(data.paginationDetails);
        setShowLabelProducts(true);
      }
    } catch (error) {
      console.error("Failed to fetch products by label:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchAllProducts = async (page = 1) => {
    try {
      setLoadingSearch(true);
      const data = await getAllProducts(
        page,
        20,
        null,
        null,
        null,
        productSearchTerm || null
      );
      if (data) {
        setAllProducts(data.data || []);
        setProductPagination(data.paginationDetails);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAddProductToLabel = async (productId) => {
    if (!selectedLabel) return;

    try {
      const result = await addLabelToProduct(productId, selectedLabel._id);
      if (result) {
        // Refresh products list
        await fetchProductsByLabel();

        // Update products search list to remove added product
        setAllProducts((prev) => prev.filter((p) => p._id !== productId));

        toast.success(`Đã thêm sản phẩm vào nhãn "${selectedLabel.name}"`);
      }
    } catch (error) {
      console.error("Failed to add product to label:", error);
    }
  };

  const handleRemoveProductFromLabel = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi nhãn?")) return;

    try {
      const result = await removeLabelFromProduct(productId);
      if (result) {
        // Refresh products list
        await fetchProductsByLabel();
        toast.success("Đã xóa sản phẩm khỏi nhãn");
      }
    } catch (error) {
      console.error("Failed to remove product from label:", error);
    }
  };

  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lọc sản phẩm chưa có nhãn hoặc có nhãn khác
  const availableProducts = allProducts.filter(
    (product) => !product.label || product.label._id !== selectedLabel?._id
  );

  const LabelCard = ({ label }) => (
    <div
      onClick={() => {
        setSelectedLabel(label);
        setShowLabelProducts(true);
      }}
      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        selectedLabel?._id === label._id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-sm rounded-full px-3 py-1 font-medium"
          style={{
            backgroundColor: label.colorBg,
            color: label.colorText,
          }}
        >
          {label.name}
        </span>
        <Package className="w-5 h-5 text-gray-400" />
      </div>

      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">ID:</span>
          <span className="text-xs font-mono">{label._id}</span>
        </div>
      </div>
    </div>
  );

  const ProductCard = ({
    product,
    showAddButton = false,
    showRemoveButton = false,
  }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {product.mainImage ? (
            <img
              src={`${API_BASE_URL}${product.mainImage}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
            {product.name}
          </h4>

          <div className="text-xs text-gray-500 space-y-1">
            <div>SKU: {product.sku}</div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-red-600">
                {product.price?.toLocaleString("vi-VN")}đ
              </span>
              {product.discountPercent > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                  -{product.discountPercent.toFixed(2)}%
                </span>
              )}
            </div>

            {product.label && (
              <div className="flex items-center gap-1">
                <span>Nhãn:</span>
                <span
                  className="text-xs rounded px-2 py-0.5"
                  style={{
                    backgroundColor: product.label.colorBg,
                    color: product.label.colorText,
                  }}
                >
                  {product.label.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {showAddButton && (
            <button
              onClick={() => handleAddProductToLabel(product._id)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
              title="Thêm vào nhãn"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {showRemoveButton && (
            <button
              onClick={() => handleRemoveProductFromLabel(product._id)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
              title="Xóa khỏi nhãn"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              Quản lý Sản phẩm theo Nhãn
            </h2>
            <p className="text-gray-600 mt-1">
              Thêm, xóa và quản lý sản phẩm trong từng nhãn
            </p>
          </div>

          {selectedLabel && (
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Labels List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Chọn Nhãn</h3>
              <span className="text-sm text-gray-500">
                {filteredLabels.length} nhãn
              </span>
            </div>

            {/* Search Labels */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm nhãn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {loadingLabels ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Đang tải...</p>
              </div>
            ) : filteredLabels.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLabels.map((label) => (
                  <LabelCard key={label._id} label={label} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Không tìm thấy nhãn</p>
              </div>
            )}
          </div>
        </div>

        {/* Products by Label */}
        <div className="lg:col-span-2">
          {selectedLabel ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    Sản phẩm của nhãn:
                    <span
                      className="text-sm rounded-full px-3 py-1 font-medium"
                      style={{
                        backgroundColor: selectedLabel.colorBg,
                        color: selectedLabel.colorText,
                      }}
                    >
                      {selectedLabel.name}
                    </span>
                  </h3>
                  {pagination && (
                    <p className="text-sm text-gray-500 mt-1">
                      {pagination.totalProducts} sản phẩm
                    </p>
                  )}
                </div>
              </div>

              {loadingProducts ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang tải sản phẩm...</p>
                </div>
              ) : labelProducts.length > 0 ? (
                <div className="space-y-4">
                  {labelProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      product={product}
                      showRemoveButton={true}
                    />
                  ))}

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => fetchProductsByLabel(i + 1)}
                          className={`px-3 py-1 rounded text-sm ${
                            pagination.currentPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    Chưa có sản phẩm nào
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Nhãn này chưa có sản phẩm nào được gán
                  </p>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Thêm sản phẩm đầu tiên
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  Chọn một nhãn
                </h4>
                <p className="text-gray-500">
                  Vui lòng chọn một nhãn để xem và quản lý sản phẩm
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Thêm sản phẩm vào nhãn "{selectedLabel?.name}"
                </h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Products */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingSearch ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang tìm kiếm...</p>
                </div>
              ) : availableProducts.length > 0 ? (
                <div className="space-y-4">
                  {availableProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      product={product}
                      showAddButton={true}
                    />
                  ))}

                  {/* Pagination */}
                  {productPagination && productPagination.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {Array.from(
                        { length: productPagination.totalPages },
                        (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => fetchAllProducts(i + 1)}
                            className={`px-3 py-1 rounded text-sm ${
                              productPagination.currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {i + 1}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    Không tìm thấy sản phẩm
                  </h4>
                  <p className="text-gray-500">
                    {productSearchTerm
                      ? "Thử thay đổi từ khóa tìm kiếm"
                      : "Tất cả sản phẩm đã được gán nhãn"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
