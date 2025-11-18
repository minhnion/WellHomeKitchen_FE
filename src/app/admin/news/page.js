"use client";
import { useState, useEffect } from "react";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { toast } from "react-toastify";
import PostHeader from "./PostHeader/PostHeader";
import { deletePost, getAllPosts } from "@/apiServices/posts";
import { getPostCategories } from "@/apiServices/postCategory";
import PostTable from "./PostTable/PostTable";

export default function PostManagement() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "draft", label: "Phát thảo" },
    { value: "published", label: "Xuất bản" },
  ];

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  //delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteSlug, setToDeleteSlug] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPostCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPosts(
          currentPage,
          itemsPerPage,
          selectedStatus,
          selectedCategory,
          searchTerm,
        );
        if (response.success) {
          setData(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalData(response.pagination.totalPosts);
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
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedStatus,
    selectedCategory,
    triggerRefresh,
  ]);

  const handleDeleteClick = (slug) => {
    setToDeleteSlug(slug);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deletePost(toDeleteSlug);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa bài viết thành công!");
      } else {
        toast.error(response.message || "Xóa bài viết thất bại!");
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

  const handleExport = () => {
    alert("Đang xuất dữ liệu");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <PostHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categoryOptions={[
          { value: "", label: "Tất cả danh mục" },
          ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
        ]}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <PostTable
        data={data}
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
        title="Bạn có chắc chắn muốn xóa bài viết này?"
      />
    </div>
  );
}
