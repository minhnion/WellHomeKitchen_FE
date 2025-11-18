"use client";
import { useState, useEffect } from "react";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import VoucherHeader from "./VoucherHeader/VoucherHeader";
import VoucherTable from "./VoucherTable/VoucherTable";
import {
  createVoucher,
  deleteVoucher,
  getVouchers,
  updateVoucher,
} from "@/apiServices/voucher";
import { getAllProducts } from "@/apiServices/products";

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [onlyActive, setOnlyActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const activeOptions = [
    { value: true, label: "Đang còn hiệu lực" },
    { value: false, label: "Hiển thị tất cả" },
  ];

  // Delete state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  // Hàm loadOptions để tải sản phẩm động cho AsyncPaginate
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

  const voucherFields = [
    {
      name: "code",
      label: "Mã Voucher (*)",
      type: "text",
      placeholder: "Nhập mã voucher",
      required: true,
    },
    {
      name: "discountType",
      label: "Loại giảm giá (*)",
      type: "select",
      options: [
        { value: "percentage", label: "Phần trăm" },
        { value: "fixed", label: "Số tiền cố định" },
      ],
    },
    {
      name: "discountValue",
      label: "Giá trị giảm (*)",
      type: "number",
      placeholder: "Nhập giá trị giảm giá (% hoặc VNĐ)",
      required: true,
    },
    {
      name: "minPurchaseAmount",
      label: "Đơn hàng tối thiểu",
      type: "number",
      placeholder: "Nhập giá trị đơn hàng tối thiểu (VNĐ)",
    },
    {
      name: "maxDiscountAmount",
      label: "Giảm tối đa",
      type: "number",
      placeholder: "Nhập giá trị giảm tối đa (VNĐ)",
    },
    {
      name: "excludedProducts",
      label: "Sản phẩm loại trừ",
      type: "select",
      multiple: true,
      async: true,
      loadOptions: loadProducts, // Sử dụng hàm loadProducts cho AsyncPaginate
      placeholder: "Chọn sản phẩm không được áp dụng voucher",
    },
    {
      name: "startDate",
      label: "Ngày bắt đầu (*)",
      type: "date",
      required: true,
    },
    {
      name: "endDate",
      label: "Ngày kết thúc (*)",
      type: "date",
      required: true,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVouchers(
          onlyActive,
          currentPage,
          itemsPerPage,
          searchTerm
        );
        if (response.success) {
          setVouchers(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalVouchers(response.pagination.totalVouchers);
        } else {
          setVouchers([]);
          setTotalPages(1);
          setTotalVouchers(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setVouchers([]);
        setTotalPages(1);
        setTotalVouchers(0);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, onlyActive, searchTerm, triggerRefresh]);

  const handleEdit = (id) => {
    const item = vouchers.find((c) => c._id === id);
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedFormData) => {
    try {
      const response = await updateVoucher(currentItem._id, updatedFormData);
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Cập nhật mã giảm giá thành công!");
      } else {
        toast.error(response.message || "Cập nhật mã giảm giá thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (brandId) => {
    setToDeleteId(brandId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteVoucher(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa mã giảm giá thành công!");
      } else {
        toast.error("Xóa mã giảm giá thất bại!");
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

  const handleAddVoucher = async (voucherData) => {
    try {
      const response = await createVoucher(voucherData);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm mã giảm giá thành công!");
      } else {
        toast.error(response.message || "Thêm mã giảm giá thất bại!");
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
      <VoucherHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAddVoucher={handleAddVoucher}
        voucherFields={voucherFields}
        activeOptions={activeOptions}
        onlyActive={onlyActive}
        setOnlyActive={setOnlyActive}
      />

      <VoucherTable
        vouchers={vouchers}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalVouchers}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
      />

      <UpdateModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdate={handleUpdate}
        title="Cập nhật mã giảm giá"
        fields={voucherFields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
