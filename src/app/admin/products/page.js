"use client";
import { useState, useEffect } from "react";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { toast } from "react-toastify";
import { getAllBrands } from "@/apiServices/brand";
import ProductTable from "./ProductTable/ProductTable";
import ProductHeader from "./ProductHeader/ProductHeader";
import { getAllCategories } from "@/apiServices/categories";
import { deleteProduct, getAllProducts } from "@/apiServices/products";
import { getSubCategories } from "@/apiServices/subCategory";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubCategoryId] = useState(null);
  const [brandId, setBrandId] = useState(null);

  //delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [categoriesData, subcategoriesData, brandsData] =
          await Promise.all([
            getAllCategories(),
            getSubCategories(),
            getAllBrands(),
          ]);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProducts(
          currentPage,
          itemsPerPage,
          categoryId,
          subcategoryId,
          brandId,
          searchTerm
        );
        if (response.success) {
          setProducts(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalProducts(response.pagination.totalProducts);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    };
    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    categoryId,
    subcategoryId,
    brandId,
    triggerRefresh,
  ]);

  const handleDeleteClick = (productId) => {
    setToDeleteId(productId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteProduct(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa sản phẩm thành công!");
      } else {
        toast.error(response.message || "Xóa sản phẩm thất bại");
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

  const handleExport = () => {
    alert("Đang xuất dữ liệu");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <ProductHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        categories={categories}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        subcategories={subcategories}
        subcategoryId={subcategoryId}
        setSubCategoryId={setSubCategoryId}
        brands={brands}
        brandId={brandId}
        setBrandId={setBrandId}
      />
      <ProductTable
        products={products}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalProducts}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Bạn có chắc chắn muốn xóa danh mục này?"
      />
    </div>
  );
}
