"use client";
import { useState, useEffect } from "react";

import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import PostCategoryHeader from "./PostCategoryHeader/PostCategoryHeader";
import PostCategoryTable from "./PostCategoryTable/PostCategoryTable";
import {
  createPostCategory,
  deletePostCategory,
  getPostCategories,
  updatePostCategory,
} from "@/apiServices/postCategory";

export default function PostCategoryManagement() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");

  //delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteSlug, setToDeleteSlug] = useState(null);

  //edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [parentOptions, setParentOptions] = useState([]);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const isRootOptions = [
    { value: "true", label: "Danh mục gốc" },
    { value: "false", label: "Tất cả danh mục" },
  ];
  const [isRootSelect, setIsRootSelect] = useState(null);

  const fields = [
    {
      name: "name",
      label: "Tên danh mục (*)",
      type: "text",
      placeholder: "Nhập tên danh mục",
      required: true,
    },
    {
      name: "parent",
      label: "Danh mục cha",
      type: "select",
      options: [...parentOptions],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPostCategories(
          currentPage,
          itemsPerPage,
          isRootSelect,
          searchTerm
        );
        if (response.success) {
          setData(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalData(response.pagination.totalCategories);
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

    const fetchParentOptions = async () => {
      try {
        const response = await getPostCategories();
        if (response.success) {
          setParentOptions(
            response.data.map((category) => ({
              value: category._id,
              label: category.name,
            }))
          );
        } else {
          setParentOptions([]);
        }
      } catch (error) {
        console.log("Error: ", error);
        setParentOptions([]);
      }
    };

    Promise.all([fetchData(), fetchParentOptions()]);
  }, [currentPage, itemsPerPage, searchTerm, triggerRefresh, isRootSelect]);

  const handleEdit = (id) => {
    const item = data.find((c) => c._id === id);
    setCurrentItem({
      ...item,
      parent: item.parent ? item.parent._id : "",
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      const response = await updatePostCategory(currentItem.slug, {
        name: data.name,
        parent: data.parent || null,
      });
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(
          response.message || "Cập nhật danh mục bài viết thành công!"
        );
      } else {
        toast.error(response.message || "Cập nhật danh mục bài viết thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (slug) => {
    setToDeleteSlug(slug);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deletePostCategory(toDeleteSlug);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa danh mục bài viết thành công!");
      } else {
        toast.error(response.message || "Xóa danh mục bài viết thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setToDeleteSlug(null);
    }
  };

  const handleAdd = async (data) => {
    try {
      const response = await createPostCategory({
        name: data.name,
        parent: data.parent || null,
      });
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm danh mục bài viết thành công!");
      } else {
        toast.error(response.message || "Thêm danh mục bài viết thất bại");
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
      <PostCategoryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAdd={handleAdd}
        fields={fields}
        isRootOptions={isRootOptions}
        isRootSelect={isRootSelect}
        setIsRootSelect={setIsRootSelect}
      />
      <PostCategoryTable
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
        title="Cập nhật danh mục bài viết"
        fields={fields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
