"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Modal from "react-modal";
import { FaTimes, FaSearch, FaSpinner } from "react-icons/fa";
import { getListFiles } from "@/apiServices/upload";
import FileImageCard from "@/app/admin/files/FileImageCard/FileImageCard";

const fileSelectModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "8px",
    maxWidth: "1600px",
    width: "95%",
    maxHeight: "95vh",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1001,
  },
};

const FILES_PER_PAGE = 40;

export default function FileSelectModal({ isOpen, onClose, onFileSelect }) {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermRef = useRef("");

  const [inputValue, setInputValue] = useState("");

  const modalContentRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false);

  const fetchFiles = async (page, keyword, isNewSearch = false) => {
    if (isLoadingRef.current && !isNewSearch) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      console.log(`Fetching page ${page} with keyword: "${keyword}"`);

      const response = await getListFiles(page, FILES_PER_PAGE, keyword, {
        signal: abortControllerRef.current.signal,
      });

      if (response?.data) {
        const newFiles = response.data;

        if (isNewSearch) {
          setFiles(newFiles);
        } else {
          setFiles((prevFiles) => {
            const existingIds = new Set(prevFiles.map((f) => f._id));
            const uniqueNewFiles = newFiles.filter(
              (f) => !existingIds.has(f._id)
            );
            return [...prevFiles, ...uniqueNewFiles];
          });
        }

        const pagination = response.pagination;
        setHasMore(page < pagination.totalPages);
        setCurrentPage(page);

        console.log(`Loaded ${newFiles.length} files for page ${page}`);
      } else {
        setHasMore(false);
        if (isNewSearch) setFiles([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching files:", error);
        setHasMore(false);
      }
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened, initializing...");
      setInputValue("");
      setSearchTerm("");
      setFiles([]);
      setCurrentPage(1);
      setHasMore(true);
      setIsLoading(true);
      fetchFiles(1, "", true);
    }
  }, [isOpen]);

  const handleSearch = (keyword) => {
    setInputValue(keyword);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      console.log("Search triggered:", keyword);
      setSearchTerm(keyword);
      searchTermRef.current = keyword;
      setFiles([]);
      setCurrentPage(1);
      setHasMore(true);
      fetchFiles(1, keyword, true);
    }, 500);
  };

  useEffect(() => {
    if (!isOpen) return;

    const setupScrollListener = () => {
      const container = modalContentRef.current;
      if (!container) {
        setTimeout(setupScrollListener, 100);
        return;
      }

      const handleScroll = () => {
        if (isLoadingRef.current) return;

        const currentHasMore = hasMore;
        if (!currentHasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
          setCurrentPage((prevPage) => {
            const nextPage = prevPage + 1;
            console.log(`Loading next page: ${nextPage}`);
            fetchFiles(nextPage, searchTermRef.current, false);
            return nextPage;
          });
        }
      };

      container.addEventListener("scroll", handleScroll, { passive: true });

      return () => container.removeEventListener("scroll", handleScroll);
    };

    const cleanup = setupScrollListener();
    return cleanup;
  }, [isOpen, searchTerm, hasMore]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Chọn ảnh từ hệ thống"
      style={fileSelectModalStyles}
    >
      <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Chọn ảnh từ hệ thống
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm ảnh theo tên..."
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div ref={modalContentRef} className="flex-grow overflow-y-auto p-6">
        {isLoading && files.length === 0 ? (
          <div className="flex justify-center items-center h-full min-h-32">
            <FaSpinner className="animate-spin text-blue-600 text-3xl" />
          </div>
        ) : files.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            Không tìm thấy ảnh nào.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {files.map((file) => (
              <div
                key={file._id}
                onClick={() => onFileSelect(file)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <FileImageCard
                  name={file.name}
                  originalName={file.originalName}
                  path={file.path}
                  onDeleteClick={(e) => e.stopPropagation()}
                  onImageClick={() => onFileSelect(file)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-center py-4 h-10">
          {isLoading && files.length > 0 && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-blue-600 mr-2" />
              <span className="text-gray-500">Đang tải thêm...</span>
            </div>
          )}
          {!hasMore && files.length > 0 && (
            <p className="text-gray-400">Đã hết ảnh.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
