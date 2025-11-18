"use client";
import { useState, useEffect } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/apiServices/categories";
import CategoryHeader from "./CategoryHeader/CategoryHeader";
import CategoryTable from "./CategoryTable/CategoryTable";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import { uploadImage } from "@/apiServices/upload";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
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

  const categoryFields = [
    {
      name: "name",
      label: "Tên danh mục (*)",
      type: "text",
      placeholder: "Nhập tên danh mục",
      required: true,
    },
    {
      name: "priority",
      label: "Số thứ tự ưu tiên (*)",
      type: "number",
      placeholder: "Nhập số thứ tự ưu tiên",
      required: true,
    },
    {
      name: "imageUrl",
      label: "Hình ảnh danh mục (*)",
      type: "file",
      accept: "image/*",
      required: true,
    },
    {
      name: "bannerUrl",
      label: "Banner danh mục",
      type: "file",
      accept: "image/*",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCategories(
          currentPage,
          itemsPerPage,
          searchTerm
        );
        if (response.success) {
          setCategories(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalCategories(response.pagination.totalCategories);
        } else {
          setCategories([]);
          setTotalPages(1);
          setTotalCategories(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setCategories([]);
        setTotalPages(1);
        setTotalCategories(0);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm, triggerRefresh]);

  const handleEdit = (id) => {
    const item = categories.find((c) => c._id === id);
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedFormData) => {
    try {
      const [imageUrl, bannerUrl] = await Promise.all([
        updatedFormData.imageUrl
          ? typeof updatedFormData.imageUrl === "string"
            ? updatedFormData.imageUrl
            : uploadImage(
                updatedFormData.imageUrl,
                `cat-${updatedFormData.name}-img`
              )
          : Promise.resolve(""),
        updatedFormData.bannerUrl
          ? typeof updatedFormData.bannerUrl === "string"
            ? updatedFormData.bannerUrl
            : uploadImage(
                updatedFormData.bannerUrl,
                `cat-${updatedFormData.name}-bnr`
              )
          : Promise.resolve(""),
      ]);

      const payload = {
        name: updatedFormData.name,
        imageUrl,
        bannerUrl,
        priority: Number(updatedFormData.priority),
      };
      const response = await updateCategory(currentItem._id, payload);
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Cập nhật danh mục thành công!");
      } else {
        toast.error(response.message || "Cập nhật danh mục thất bại!");
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
      const response = await deleteCategory(toDeleteId);
      if (response) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa danh mục thành công!");
      } else {
        toast.error(response.message || "Xóa danh mục thất bại!");
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

  const handleAddCategory = async (categoryData) => {
    try {
      const [imageUrl, bannerUrl] = await Promise.all([
        categoryData.imageUrl
          ? typeof categoryData.imageUrl === "string"
            ? categoryData.imageUrl
            : uploadImage(categoryData.imageUrl, `cat-${categoryData.name}-img`)
          : Promise.resolve(""),
        categoryData.bannerUrl
          ? typeof categoryData.bannerUrl === "string"
            ? categoryData.bannerUrl
            : uploadImage(
                categoryData.bannerUrl,
                `cat-${categoryData.name}-bnr`
              )
          : Promise.resolve(""),
      ]);

      const payload = {
        name: categoryData.name,
        imageUrl,
        bannerUrl,
        priority: Number(categoryData.priority),
      };
      const response = await createCategory(payload);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm danh mục thành công!");
      } else {
        toast.error(response.message || "Thêm danh mục thất bại!");
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
      <CategoryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAddCategory={handleAddCategory}
        categoryFields={categoryFields}
      />
      <CategoryTable
        categories={categories}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalCategories}
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
        title="Cập nhật danh mục"
        fields={categoryFields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
