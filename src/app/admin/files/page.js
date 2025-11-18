"use client";
import { deleteFile, getListFiles, uploadImage } from "@/apiServices/upload";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import FileImageCard from "./FileImageCard/FileImageCard";
import ImageViewModal from "./ImageViewModal/ImageViewModal";
import { FaSearch, FaSpinner } from "react-icons/fa";

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(35);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDeleteFile, setToDeleteFile] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const singleFileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const fetchFiles = useCallback(
    async (page, keyword) => {
      setIsLoading(true);
      try {
        const response = await getListFiles(page, limit, keyword);
        if (response) {
          setFiles(response.data);
          setTotalPages(response.pagination.totalPages);
          setTotalFiles(response.pagination.totalFiles);
        } else {
          setFiles([]);
          setTotalPages(1);
          setTotalFiles(0);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Lỗi khi tải danh sách file.");
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchFiles(currentPage, searchTerm.trim());
  }, [currentPage, triggerRefresh, fetchFiles]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        setTriggerRefresh((prev) => !prev);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleDeleteClick = (file) => {
    setToDeleteFile(file);
    setDeleteModalOpen(true);
  };

  const handleImageClick = (file) => {
    setSelectedImage(file);
    setImageModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const filename = toDeleteFile.path.split("/").pop();
      const response = await deleteFile(filename);
      if (response) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Xóa file ảnh thành công!");
      } else {
        toast.error(response.message || "Xóa file ảnh thất bại");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra.";
      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setToDeleteFile(null);
    }
  };

  const handleSingleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const response = await uploadImage(file, file.name);
      if (response) {
        setTriggerRefresh((prev) => !prev);
        toast.success(response.message || "Tải ảnh lên thành công!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Tải ảnh lên thất bại");
    } finally {
      singleFileInputRef.current.value = null;
    }
  };

  const handleFolderUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (selectedFiles.length === 0) {
      toast.warn("Không tìm thấy file ảnh hợp lệ trong thư mục!");
      return;
    }
    try {
      await Promise.all(
        selectedFiles.map((file) => uploadImage(file, file.name))
      );
      setTriggerRefresh((prev) => !prev);
      toast.success(`Tải ${selectedFiles.length} ảnh lên thành công!`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Một số ảnh tải lên thất bại"
      );
    } finally {
      folderInputRef.current.value = null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm theo tên file..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-80 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex justify-end w-full sm:w-auto sm:gap-4 gap-2">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleSingleFileUpload}
              ref={singleFileInputRef}
              className="hidden"
              id="single-file-upload"
            />
            <label
              htmlFor="single-file-upload"
              className="w-full text-center inline-block px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Tải lên một ảnh
            </label>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              webkitdirectory="true"
              directory=""
              onChange={handleFolderUpload}
              ref={folderInputRef}
              className="hidden"
              id="folder-upload"
            />
            <label
              htmlFor="folder-upload"
              className="w-full text-center inline-block px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition-colors"
            >
              Tải lên thư mục
            </label>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-blue-600 text-4xl" />
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-600 py-10">
          Không tìm thấy file nào.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
          {files.map((file) => (
            <FileImageCard
              key={file._id}
              name={file.name}
              originalName={file.originalName}
              path={file.path}
              onDeleteClick={handleDeleteClick}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
      )}

      {!isLoading && totalFiles > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalFiles}
          itemsPerPage={limit}
          setCurrentPage={setCurrentPage}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Bạn có chắc chắn muốn xóa file ảnh này?"
      />

      <ImageViewModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        image={selectedImage}
      />
    </div>
  );
}
