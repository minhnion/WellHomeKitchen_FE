"use client";
import { useState, useEffect } from "react";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import OrderHeader from "./OrderHeader/OrderHeader";
import OrderTable from "./OrderTable/OrderTable";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderCode,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/apiServices/order";
import { getAllProducts } from "@/apiServices/products";

export default function Orders() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");

  const status = [
    { value: "pending", label: "Chờ xử lý" },
    { value: "shipped", label: "Đang giao" },
    { value: "delivered", label: "Đã giao" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  const loadProducts = async (search, loadedOptions, { page }) => {
    try {
      const response = await getAllProducts(page, 10, null, null, null, search);
      if (!response || !response.data) {
        return {
          options: [],
          hasMore: false,
        };
      }
      const options = response.data.map((product) => ({
        value: product._id,
        label: product.name,
      }));
      return {
        options,
        hasMore: page < response.pagination.totalPages,
        additional: { page: page + 1 },
      };
    } catch (error) {
      console.error("Error loading products:", error);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const [selectedStatus, setSelectedStatus] = useState(null);

  //delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  //edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const updateDataFields = [
    {
      name: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: "pending", label: "Chờ xử lý" },
        { value: "shipped", label: "Đang giao" },
        { value: "delivered", label: "Đã giao" },
        { value: "cancelled", label: "Đã hủy" },
      ],
    },
    {
      name: "paymentStatus",
      label: "Trạng thái thanh toán",
      type: "select",
      options: [
        { value: "pending", label: "Chờ thanh toán" },
        { value: "paid", label: "Đã thanh toán" },
        { value: "failed", label: "Thất bại" },
      ],
    },
  ];

  const addDataFields = [
    {
      name: "products",
      label: "Sản phẩm (*)",
      type: "custom",
      subFields: [
        {
          name: "productId",
          label: "Sản phẩm (*)",
          type: "async",
          loadOptions: loadProducts,
          placeholder: "Chọn sản phẩm",
        },
        {
          name: "quantity",
          label: "Số lượng",
          type: "number",
          min: 1,
        },
      ],
      placeholder: "Thêm sản phẩm",
    },
    { name: "userName", label: "Tên khách hàng (*)", type: "text" },
    { name: "userPhone", label: "Số điện thoại (*)", type: "text" },
    { name: "userEmail", label: "Email", type: "text" },
    { name: "district", label: "Tỉnh/Thành phố", type: "text" },
    { name: "address", label: "Địa chỉ chi tiết", type: "text" },
    { name: "note", label: "Ghi chú", type: "text" },
    {
      name: "paymentMethod",
      label: "Phương thức thanh toán (*)",
      type: "select",
      options: [
        { value: "cod", label: "Thanh toán khi nhận hàng" },
        { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
        { value: "vn_pay", label: "VN Pay" },
        { value: "momo", label: "Momo" },
      ],
    },
    {
      name: "voucherCode",
      label: "Mã giảm giá",
      type: "text",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllOrders(
          currentPage,
          itemsPerPage,
          selectedStatus,
          searchTerm
        );
        if (response.success) {
          setData(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalData(response.pagination.total);
        } else {
          setData([]);
          setTotalPages(1);
          setTotalData(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setData([]);
        setTotalPages(1);
        setTotalData(0);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm, selectedStatus, triggerRefresh]);

  const handleEdit = (id) => {
    const item = data.find((c) => c._id === id);
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedFormData) => {
    try {
      // Update order status if changed
      if (
        updatedFormData.status &&
        updatedFormData.status !== currentItem.status
      ) {
        const statusResponse = await updateOrderStatus(
          currentItem._id,
          updatedFormData.status
        );
        if (statusResponse.success) {
          setEditModalOpen(false);
          setTriggerRefresh((prev) => !prev);
          toast.success(
            statusResponse.message || "Cập nhật trạng thái đơn hàng thành công!"
          );
        } else {
          toast.error(
            statusResponse.message || "Cập nhật trạng thái đơn hàng thất bại!"
          );
        }
      }

      // Update payment status if changed
      if (
        updatedFormData.paymentStatus &&
        updatedFormData.paymentStatus !== currentItem.paymentStatus
      ) {
        const paymentResponse = await updatePaymentStatus(
          currentItem._id,
          updatedFormData.paymentStatus
        );
        if (paymentResponse.success) {
          setTriggerRefresh((prev) => !prev);
          toast.success(
            paymentResponse.message ||
              "Cập nhật trạng thái đơn hàng thành công!"
          );
        } else {
          toast.error(
            paymentResponse.message || "Cập nhật trạng thái đơn hàng thất bại!"
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
    setEditModalOpen(false);
  };

  const handleDeleteClick = (brandId) => {
    setToDeleteId(brandId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteOrder(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa đơn hàng thành công!");
      } else {
        toast.error(response.message || "Xóa đơn hàng thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setToDeleteId(null);
    }
  };

  const handleAdd = async (formData) => {
    try {
      const orderCode = await getOrderCode();

      // Construct payload
      const payload = {
        orderCode,
        products: formData.products || [],
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        district: formData.district,
        address: formData.address,
        note: formData.note,
        voucherCode: formData.voucherCode,
        paymentMethod: formData.paymentMethod,
      };

      const response = await createOrder(payload);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm đơn hàng thành công!");
      } else {
        toast.error(response.message || "Thêm đơn hàng thất bại");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  };

  const handleExport = () => {
    alert("Đang xuất dữ liệu");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <OrderHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAdd={handleAdd}
        dataFields={addDataFields}
        status={status}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <OrderTable
        data={data}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalData}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Bạn có chắc chắn muốn xóa danh mục này?"
      />

      <UpdateModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdate}
        title="Cập nhật đơn hàng"
        fields={updateDataFields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
