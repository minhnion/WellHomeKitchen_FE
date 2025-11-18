"use client";
import { useState, useEffect } from "react";

import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import AccountHeader from "./AccountHeader/AccountHeader";
import AccountTable from "./AccountTable/AccountTable";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/apiServices/users";

export default function data() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");

  //delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  //edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const roleOptions = [
    { value: "user", label: "Người dùng" },
    { value: "content-creator", label: "Tạo nội dung" },
    { value: "product-manager", label: "Quản lý sản phẩm" },
    { value: "admin", label: "Quản trị viên" },
  ];
  const [roleSelect, setRoleSelect] = useState(null);

  const updateFields = [
    {
      name: "role",
      label: "Vai trò",
      type: "select",
      options: roleOptions,
    },
  ];

  const addFields = [
    {
      name: "email",
      label: "Email (*)",
      type: "text",
      placeholder: "Nhập email",
      required: true,
    },
    {
      name: "userName",
      label: "Tên nguời dùng (*)",
      type: "text",
      placeholder: "Nhập tên người dùng",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Số điện thoại (*)",
      type: "text",
      placeholder: "Nhập số điện thoại",
      required: true,
    },
    {
      name: "password",
      label: "Mật khẩu (*)",
      type: "text",
      placeholder: "Nhập mật khẩu",
      required: true,
    },
    {
      name: "role",
      label: "Vai trò (*)",
      type: "select",
      options: roleOptions,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(
          currentPage,
          itemsPerPage,
          roleSelect,
          searchTerm
        );
        if (response.success) {
          setData(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalData(response.pagination.totalUsers);
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
  }, [currentPage, itemsPerPage, searchTerm, triggerRefresh, roleSelect]);

  const handleEdit = (id) => {
    const item = data.find((c) => c._id === id);
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      const response = await updateUser(currentItem._id, data);
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(
          response.message || "Cập nhật quyền tài khoản thành công!"
        );
      } else {
        toast.error(response.message || "Cập nhật quyền tài khoản thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (categoryId) => {
    setToDeleteId(categoryId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUser(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa tài khoản thành công!");
      } else {
        toast.error(response.message || "Xóa tài khoản thất bại!");
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

  const handleAdd = async (data) => {
    try {
      const response = await createUser(data);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm tài khoản thành công!");
      } else {
        toast.error(response.message || "Thêm tài khoản thất bại!");
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
      <AccountHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAdd={handleAdd}
        fields={addFields}
        roleOptions={roleOptions}
        roleSelect={roleSelect}
        setRoleSelect={setRoleSelect}
      />
      <AccountTable
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
        title="Cập nhật quyền tài khoản"
        fields={updateFields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
