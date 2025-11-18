"use client";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";
import { formatPrice } from "@/utils/formatPrice";
import { Fragment, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const OrderTable = ({ data, handleDelete, handleEdit, page, limit }) => {
  // State to track which order's details are expanded
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Toggle details visibility
  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Map order status to Vietnamese display
  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Define color classes for order status
  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "shipped":
        return "text-blue-700 bg-blue-100";
      case "delivered":
        return "text-green-700 bg-green-100";
      case "cancelled":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  // Map payment status to Vietnamese display
  const getPaymentStatusDisplay = (paymentStatus) => {
    switch (paymentStatus) {
      case "pending":
        return "Chờ thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "failed":
        return "Thất bại";
      default:
        return paymentStatus;
    }
  };

  // Define color classes for payment status
  const getPaymentStatusStyles = (paymentStatus) => {
    switch (paymentStatus) {
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "paid":
        return "text-green-700 bg-green-100";
      case "failed":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "vn_pay":
        return "VN Pay";
      case "momo":
        return "Momo";
      default:
        return method;
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã đơn
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Khách hàng
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tổng tiền
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thanh toán
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((order, index) => (
            <Fragment key={order._id}>
              <tr className="hover:bg-gray-50 transition-colors text-xs">
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => toggleDetails(order._id)}
                  >
                    {order.orderCode}
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">
                    {order.userName}
                  </div>
                  <div className="text-gray-500">{order.userPhone}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {order.products.map((item, index) => (
                    <div
                      key={item._id}
                      className="flex items-center mb-2 last:mb-0"
                    >
                      <div className="flex-shrink-0 bg-gray-100 rounded-md overflow-hidden w-10 h-10">
                        <Image
                          className="object-cover"
                          src={
                            new URL(item.productId.mainImage, API_BASE_URL).href
                          }
                          alt={item.productId.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="ml-2">
                        <div
                          className="font-semibold text-gray-900 truncate max-w-[150px]"
                          title={item.productId.name}
                        >
                          {item.productId.name}
                        </div>
                        <div className="text-gray-500">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <div className="font-medium text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </div>
                  {order.shippingFee > 0 && (
                    <div className="text-gray-500 text-[0.6rem]">
                      Phí vận chuyển: {formatPrice(order.shippingFee)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[0.6rem] font-semibold rounded-full ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    {getStatusDisplay(order.status)}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <span
                    className={`inline-block px-2 py-0.5 text-[0.6rem] font-semibold rounded-full ${getPaymentStatusStyles(
                      order.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusDisplay(order.paymentStatus)}
                  </span>
                  {order.paymentMethod && (
                    <div className="text-gray-500 text-[0.6rem] mt-1">
                      {formatPaymentMethod(order.paymentMethod)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(order._id)}
                      className="p-1 hover:bg-blue-50 rounded"
                      title="Chỉnh sửa"
                    >
                      <FaEdit className="text-sm text-blue-600" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(order._id)}
                      className="p-1 hover:bg-red-50 rounded"
                      title="Xóa"
                    >
                      <FaTrash className="text-sm text-red-600" />
                    </button> */}
                  </div>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr>
                  <td colSpan="8" className="px-4 py-2 bg-gray-50">
                    <div className="text-xs text-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p>
                            <strong>Email:</strong> {order.userEmail || "N/A"}
                          </p>
                          <p>
                            <strong>Tỉnh/Thành phố:</strong>{" "}
                            {order.district || "N/A"}
                          </p>
                          <p>
                            <strong>Địa chỉ chi tiết:</strong> {order.address || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Ghi chú:</strong> {order.note || "N/A"}
                          </p>
                          <p>
                            <strong>Voucher:</strong>{" "}
                            {order.voucher?.code || "N/A"}
                          </p>
                          <p>
                            <strong>Ngày tạo:</strong>{" "}
                            {formatDate(order.createdAt)}
                          </p>
                          <p>
                            <strong>Ngày cập nhật:</strong>{" "}
                            {formatDate(order.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
