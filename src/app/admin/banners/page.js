"use client";
import { useState, useEffect } from "react";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/apiServices/banner";
import BannerHeader from "./BannerHeader/BannerHeader";
import BannerTable from "./BannerTable/BannerTable";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import { toast } from "react-toastify";
import { uploadImage } from "@/apiServices/upload";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBanners, setTotalBanners] = useState(0);
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

  const typeOptions = [
    { value: "slider-full", label: "Rộng toàn màn hình" },
    { value: "slider-part", label: "Rộng một phần màn hình" },
  ];
  const [typeSelect, setTypeSelect] = useState(null);

  const isShowOptions = [
    { value: true, label: "Hiện thị" },
    { value: false, label: "Tạm ẩn" },
  ];
  const [isShowSelect, setIsShowSelect] = useState(null);

  const fields = [
    {
      name: "title",
      label: "Tiêu đề banner (*)",
      type: "text",
      placeholder: "Tiêu đề banner",
      required: true,
    },
    {
      name: "priority",
      label: "Số thứ tự ưu tiên",
      type: "number",
      placeholder: "Nhập số thứ tự ưu tiên",
      required: true,
    },
    {
      name: "url",
      label: "Hình ảnh destop (*)",
      type: "file",
      accept: "image/*",
    },
    {
      name: "mobileUrl",
      label: "Hình ảnh mobile(nếu có)",
      type: "file",
      accept: "image/*",
    },
    {
      name: "link",
      label: "Link tới trang (*)",
      type: "text",
      placeholder: "VD: may-rua-bat/bosch/...",
      required: true,
    },
    {
      name: "type",
      label: "Phân loại (*)",
      type: "select",
      options: typeOptions,
    },
    {
      name: "isShow",
      label: "Trạng thái (*)",
      type: "select",
      options: isShowOptions,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBanners(
          currentPage,
          itemsPerPage,
          isShowSelect,
          typeSelect,
          searchTerm
        );
        if (response.success) {
          setBanners(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalBanners(response.pagination.totalBanners);
        } else {
          setBanners([]);
          setTotalPages(1);
          setTotalBanners(0);
        }
      } catch (error) {
        console.log("Error: ", error);
        setBanners([]);
        setTotalPages(1);
        setTotalBanners(0);
      }
    };
    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    triggerRefresh,
    isShowSelect,
    typeSelect,
  ]);

  const handleEdit = (id) => {
    const item = banners.find((c) => c._id === id);
    setCurrentItem(item);
    setEditModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      const [url, mobileUrl] = await Promise.all([
        data.url
          ? typeof data.url === "string"
            ? data.url
            : uploadImage(data.url, `ban-${data.title}-img-des`)
          : Promise.resolve(""),
        data.mobileUrl
          ? typeof data.mobileUrl === "string"
            ? data.mobileUrl
            : uploadImage(data.mobileUrl, `ban-${data.title}-img-mob`)
          : Promise.resolve(""),
      ]);
      const payload = {
        ...data,
        url,
        mobileUrl,
        priority: Number(data.priority),
      };
      const response = await updateBanner(currentItem._id, payload);
      if (response.success) {
        setEditModalOpen(false);
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Cập nhật banner thành công!");
      } else {
        toast.error(response.message || "Cập nhật banner thất bại!");
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
      const response = await deleteBanner(toDeleteId);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa banner thành công!");
      } else {
        toast.error(response.message || "Xóa banner thất bại!");
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
      const [url, mobileUrl] = await Promise.all([
        data.url
          ? typeof data.url === "string"
            ? data.url
            : uploadImage(data.url, `ban-${data.title}-img-des`)
          : Promise.resolve(""),
        data.mobileUrl
          ? typeof data.mobileUrl === "string"
            ? data.mobileUrl
            : uploadImage(data.mobileUrl, `ban-${data.title}-img-mob`)
          : Promise.resolve(""),
      ]);
      const payload = {
        ...data,
        url,
        mobileUrl,
        priority: Number(data.priority),
      };
      const response = await createBanner(payload);
      if (response.success) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Thêm banner thành công!");
      } else {
        toast.error(response.message || "Thêm banner thất bại!");
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
      <BannerHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        handleExport={handleExport}
        handleAdd={handleAdd}
        fields={fields}
        typeOptions={typeOptions}
        typeSelect={typeSelect}
        setTypeSelect={setTypeSelect}
        isShowOptions={isShowOptions}
        isShowSelect={isShowSelect}
        setIsShowSelect={setIsShowSelect}
      />
      <BannerTable
        banners={banners}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        page={currentPage}
        limit={itemsPerPage}
      />
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalBanners}
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
        title="Cập nhật banner"
        fields={fields}
        initialData={currentItem || {}}
      />
    </div>
  );
}
