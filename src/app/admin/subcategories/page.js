"use client";
import { useState, useEffect } from "react";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import { uploadImage } from "@/apiServices/upload";
import SubCategoryHeader from "./SubCategoryHeader/SubCategoryHeader";
import { getAllCategories } from "@/apiServices/categories";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategoriesWithPagination,
  updateSubCategory,
} from "@/apiServices/subCategory";
import SubCategoryTable from "./SubCategoryTable/SubCategoryTable";

export default function SubCategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubcategories, setTotalSubcategories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  //delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  //edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const subcategoryFields = [
    {
      name: "name",
      label: "Tên phân loại",
      type: "text",
      placeholder: "Nhập tên phân loại",
      required: true,
    },
    {
      name: "imageUrl",
      label: "Hình ảnh phân loại",
      type: "file",
      accept: "image/*",
    },
    {
      name: "categoryId",
      label: "Danh mục",
      type: "select",
      multiple: false,
      placeholder: "Chọn danh mục",
      options: categories.map((category) => ({
        value: category._id,
        label: category.name,
      })),
      required: true,
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.log("Error fetching categories: ", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSubCategoriesWithPagination(
          categoryId,
          currentPage,
          itemsPerPage,
          searchTerm
        );
        if (response.success) {
          setSubcategories(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalSubcategories(response.pagination.totalSubcategories);
        } else {
          setSubcategories([]);
          setTotalPages(1);
          setTotalSubcategories(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setSubcategories([]);
        setTotalPages(1);
        setTotalSubcategories(0);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm, categoryId, triggerRefresh]);

  const handleEdit = (id) => {
    const item = subcategories.find((c) => c._id === id);
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedFormData) => {
    try {
      const imageUrl = updatedFormData.imageUrl
        ? typeof updatedFormData.imageUrl === "string"
          ? updatedFormData.imageUrl
          : await uploadImage(
              updatedFormData.imageUrl,
              `sub-${updatedFormData.name}-img`
            )
        : "";

      const payload = {
        name: updatedFormData.name,
        imageUrl,
        categoryId: updatedFormData.categoryId,
      };
      const response = await updateSubCategory(currentItem._id, payload);
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(
          response.message || "Cập nhật phân loại danh mục thành công!"
        );
      } else {
        toast.error(
          response.message || "Cập nhật phân loại danh mục thất bại!"
        );
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
      const response = await deleteSubCategory(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa phân loại danh mục thành công!");
      } else {
        toast.error(response.message || "Xóa phân loại danh mục thất bại!");
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

  const handleAddSubCategory = async (subcategoryData) => {
    try {
      const imageUrl = subcategoryData.imageUrl
        ? typeof subcategoryData.imageUrl === "string"
          ? subcategoryData.imageUrl
          : await uploadImage(
              subcategoryData.imageUrl,
              `sub-${subcategoryData.name}-img`
            )
        : "";

      const payload = {
        name: subcategoryData.name,
        imageUrl,
        categoryId: subcategoryData.categoryId,
      };
      const response = await createSubCategory(payload);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(
          response.message || "Thêm phân loại danh mục thành công!"
        );
      } else {
        toast.error(response.message || "Thêm phân loại danh mục thất bại!");
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
      <SubCategoryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAddSubCategory={handleAddSubCategory}
        subcategoryFields={subcategoryFields}
        categories={categories}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      />
      <SubCategoryTable
        subcategories={subcategories}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalSubcategories}
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
        title="Cập nhật phân loại danh mục"
        fields={subcategoryFields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
