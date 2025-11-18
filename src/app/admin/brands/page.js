"use client";
import { useState, useEffect } from "react";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import { uploadImage } from "@/apiServices/upload";
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "@/apiServices/brand";
import BrandTable from "./BrandTable/BrandTable";
import BrandHeader from "./BrandHeader/BrandHeader";
import { getAllCategories } from "@/apiServices/categories";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBrands, setTotalBrands] = useState(0);
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

  const brandFields = [
    {
      name: "name",
      label: "Tên thương hiệu (*)",
      type: "text",
      placeholder: "Nhập tên thương hiệu",
      required: true,
    },
    {
      name: "imageUrl",
      label: "Hình ảnh thương hiệu (*)",
      type: "file",
      accept: "image/*",
    },
    {
      name: "categoryIds",
      label: "Danh mục (*)",
      type: "select",
      multiple: true,
      placeholder: "Chọn các danh mục",
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
        const response = await getBrands(
          categoryId,
          currentPage,
          itemsPerPage,
          searchTerm
        );
        if (response.success) {
          setBrands(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalBrands(response.pagination.totalBrands);
        } else {
          setBrands([]);
          setTotalPages(1);
          setTotalBrands(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setBrands([]);
        setTotalPages(1);
        setTotalBrands(0);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm, categoryId, triggerRefresh]);

  const handleEdit = (id) => {
    const item = brands.find((c) => c._id === id);
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
              `bra-${updatedFormData.name}-img`
            )
        : "";

      const payload = {
        name: updatedFormData.name,
        imageUrl,
        categoryIds: updatedFormData.categoryIds,
      };
      const response = await updateBrand(currentItem._id, payload);
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Cập nhật thương hiệu thành công!");
      } else {
        toast.error(response.message || "Cập nhật thương hiệu thất bại!");
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
      const response = await deleteBrand(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa thương hiệu thành công!");
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

  const handleAddBrand = async (brandData) => {
    try {
      const imageUrl = brandData.imageUrl
        ? typeof brandData.imageUrl === "string"
          ? brandData.imageUrl
          : await uploadImage(brandData.imageUrl, `bra-${brandData.name}-img`)
        : "";

      const payload = {
        name: brandData.name,
        imageUrl,
        categoryIds: brandData.categoryIds,
      };
      const response = await createBrand(payload);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm thương hiệu thành công!");
      } else {
        toast.error(response.message || "Thêm thương hiệu thất bại!");
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
      <BrandHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAddBrand={handleAddBrand}
        brandFields={brandFields}
        categories={categories}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      />
      <BrandTable
        brands={brands}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalBrands}
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
        title="Cập nhật thương hiệu"
        fields={brandFields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
