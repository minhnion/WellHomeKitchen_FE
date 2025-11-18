"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import {
  cancelOrder,
  getOrderByUserId,
  getOrderByAnonymousId,
} from "@/apiServices/order";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { getAnonymousId } from "@/utils/anonymousUtils";
import SuccessPopUp from "@/app/mua-hang/SuccessPopUp";

export default function OrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [toCancelId, setToCancelId] = useState(null);
  //
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = useState("");

  const showPopUp = (order) => {
    setOrderCode(order.id);
    setTotal(order.total);
    setOrderId(order._id);
    setShowSuccessPopUp(true);
  };
  //
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id || null;
  };

  const isAuthenticated = () => {
    return !!getUserId();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let response;
        if (isAuthenticated()) {
          const userId = getUserId();
          response = await getOrderByUserId(
            userId,
            pagination.page,
            pagination.limit,
            filterStatus !== "all" ? filterStatus : "",
            searchTerm
          );
        } else {
          const anonymousId = getAnonymousId();
          response = await getOrderByAnonymousId(
            anonymousId,
            pagination.page,
            pagination.limit,
            filterStatus !== "all" ? filterStatus : "",
            searchTerm
          );
        }

        if (response.success) {
          const mappedOrders = response.data.map((order) => ({
            id: order.orderCode,
            _id: order._id,
            date: new Date(order.createdAt).toISOString().split("T")[0],
            status: order.status,
            total: order.totalAmount,
            items: order.products.map((product) => ({
              name: product.productId.name,
              quantity: product.quantity,
              price: product.productId.price,
              image: product.productId.mainImage,
              discountPercent: product.productId.discountPercent || 0,
            })),
            customer: {
              name: order.userName,
              phone: order.userPhone,
              address: `${order.address}, ${order.district}`,
            },
            details: {
              userId: order.userId,
              anonymousId: order.anonymousId,
              userEmail: order.userEmail,
              district: order.district,
              address: order.address,
              note: order.note,
              voucher: order.voucher,
              paymentMethod: order.paymentMethod,
              paymentStatus: order.paymentStatus,
              shippingFee: order.shippingFee,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
            },
          }));
          setOrders(mappedOrders);
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            totalPages: response.pagination.totalPages,
          });
        } else {
          toast.error(response.message || "Lỗi khi lấy danh sách đơn hàng.");
        }
      } catch (err) {
        toast.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    pagination.page,
    pagination.limit,
    filterStatus,
    searchTerm,
    triggerRefresh,
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Đã giao";
      case "shipped":
        return "Đang giao";
      case "pending":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chưa thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      default:
        return "Không xác định";
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "card":
        return "Thanh toán bằng thẻ";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      default:
        return method || "Không xác định";
    }
  };

  const handleCancelClick = (orderId) => {
    setToCancelId(orderId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await cancelOrder(toCancelId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Hủy đơn hàng thành công!");
      } else {
        toast.error(response.message || "Hủy đơn hàng thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";
      toast.error(errorMessage);
    } finally {
      setCancelModalOpen(false);
      setToCancelId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-3 h-3" />;
      case "shipped":
        return <Truck className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "cancelled":
        return <X className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const handleToggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    setExpandedOrder(null);
  };

  const handlePriceValue = (value, discountPercent) => {
    if (discountPercent && discountPercent > 0) {
      const discountAmount = (value * discountPercent) / 100;
      return formatPrice(value - discountAmount);
    }
    return formatPrice(value);
  }

  return (
    <div className="mx-auto max-w-7xl container">
      <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
        <nav className="flex flex-wrap items-center mb-6 text-sm text-gray-500 overflow-hidden">
          <Link href="/" className="hover:text-primary whitespace-nowrap">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 truncate max-sm:max-w-[120px] sm:max-w-[200px] md:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
            Đơn hàng
          </span>
        </nav>

        <div className="bg-white rounded-md shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                Lọc trạng thái:
              </span>
              <select
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Đang xử lý</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                Tìm kiếm:
              </span>
              <input
                type="text"
                placeholder="Mã đơn"
                className="border border-gray-300 rounded-md px-2 py-1 text-sm w-48"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-md shadow-sm p-8 text-center">
            <p className="text-sm text-gray-500">Đang tải đơn hàng...</p>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-md shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-xs text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa
            </p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-md shadow-sm border border-gray-200"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items.length} sản phẩm
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="font-medium text-gray-700">Khách hàng</p>
                      <p className="text-gray-900">{order.customer.name}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Số điện thoại</p>
                      <p className="text-gray-900">{order.customer.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Địa chỉ</p>
                      <p className="text-gray-900">{order.customer.address}</p>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="bg-gray-200 rounded-md flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={`${API_BASE_URL}${item.image}`}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        {/* old price display */}
                        { item.discountPercent && item.discountPercent > 0 && (
                        <p className="text-sm font-medium text-gray-500 line-through">
                          {formatPrice(item.price)}
                        </p>
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {handlePriceValue(item.price, item.discountPercent)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleDetails(order.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center"
                      >
                        Chi tiết
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </button>
                      {order.status === "pending" && (
                        <button
                          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                          onClick={() => handleCancelClick(order._id)}
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.details &&
                        order.details.paymentMethod === "bank_transfer" &&
                        order.details.paymentStatus === "pending" && (
                          <button
                            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                            onClick={() => {
                              showPopUp(order);
                            }}
                          >
                            Thanh toán
                          </button>
                        )}
                      {/* {order.status === "delivered" && (
                        <button className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100">
                          Đánh giá
                        </button>
                      )} */}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tổng:{" "}
                      <span className="font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <p className="text-gray-900">
                          {order.details.userEmail || "Không có"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Phương thức thanh toán
                        </p>
                        <p className="text-gray-900">
                          {getPaymentMethodText(order.details.paymentMethod)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Trạng thái thanh toán
                        </p>
                        <p className="text-gray-900">
                          {getPaymentStatusText(order.details.paymentStatus)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Phí vận chuyển
                        </p>
                        <p className="text-gray-900">
                          {formatPrice(order.details.shippingFee)}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Ghi chú</p>
                        <p className="text-gray-900">
                          {order.details.note || "Không có"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Mã giảm giá</p>
                        <p className="text-gray-900">
                          {order.details.voucher || "Không có"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Ngày tạo</p>
                        <p className="text-gray-900">
                          {new Date(order.details.createdAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">
                          Ngày cập nhật
                        </p>
                        <p className="text-gray-900">
                          {new Date(order.details.updatedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            isLoading={loading}
            onPageChange={handlePageChange}
          />
        )}
        <DeleteConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          title="Bạn có chắc chắn muốn hủy đơn hàng này?"
          deleteButton="Hủy đơn"
        />
        {showSuccessPopUp && (
          <SuccessPopUp
            isCloseHeader={false}
            orderCode={orderCode}
            total={total}
            orderId={orderId}
            paymentMethod="bank_transfer"
            setShowSuccessPopUp={setShowSuccessPopUp}
          />
        )}
      </main>
    </div>
  );
}
