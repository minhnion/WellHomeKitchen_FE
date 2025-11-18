"use client";
import { FaEdit, FaTrash } from "react-icons/fa";

const VoucherTable = ({ vouchers, handleEdit, handleDelete, page, limit }) => {
  // Format price with VND currency
  const formatVND = (amount) => {
    if (!amount && amount !== 0) return "-";
    return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
  };

  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format discount type with Vietnamese labels and colors
  const formatDiscountType = (type) => {
    if (type === "percentage") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Phần trăm
        </span>
      );
    } else if (type === "fixed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Cố định
        </span>
      );
    }
    return "-";
  };

  // Format discount value based on type
  const formatDiscountValue = (value, type) => {
    if (!value && value !== 0) return "-";
    if (type === "percentage") {
      return `${value}%`;
    } else if (type === "fixed") {
      return formatVND(value);
    }
    return value;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              STT
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Mã voucher
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Loại giảm giá
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Giá trị giảm
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Đơn hàng tối thiểu
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Giảm tối đa
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Sản phẩm loại trừ
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Thời gian hiệu lực
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vouchers.map((voucher, index) => (
            <tr
              key={voucher._id}
              className={`hover:bg-blue-50 transition-all duration-200 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="px-4 py-3 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>

              <td
                className="px-4 py-3 whitespace-nowrap text-center cursor-pointer"
                onClick={() => handleEdit(voucher._id)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {voucher.code || "-"}
                </div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-center">
                {formatDiscountType(voucher.discountType)}
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {formatDiscountValue(
                    voucher.discountValue,
                    voucher.discountType
                  )}
                </div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-700">
                  {formatVND(voucher.minPurchaseAmount)}
                </div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-700">
                  {formatVND(voucher.maxDiscountAmount)}
                </div>
              </td>

              <td className="px-4 py-3 text-center">
                <div
                  className="flex flex-wrap justify-center gap-1 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full"
                  style={{ minWidth: 140, maxWidth: 200 }}
                >
                  {voucher.excludedProducts &&
                  voucher.excludedProducts.length > 0 ? (
                    voucher.excludedProducts.map((product) => (
                      <span
                        key={product._id}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full border border-red-200"
                        title={product.name}
                      >
                        {product.name && product.name.length > 10
                          ? `${product.name.substring(0, 10)}...`
                          : product.name || "N/A"}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      Không có
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">
                    {formatDate(voucher.startDate)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">đến</div>
                  <div className="font-medium">
                    {formatDate(voucher.endDate)}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(voucher._id)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200 group"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-sm text-blue-600 group-hover:text-blue-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(voucher._id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200 group"
                    title="Xóa"
                  >
                    <FaTrash className="text-sm text-red-600 group-hover:text-red-700" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {vouchers.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">Không có dữ liệu voucher</div>
        </div>
      )}
    </div>
  );
};

export default VoucherTable;
