import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, isLoading, onPageChange }) => {
  const [maxVisible, setMaxVisible] = useState(5); // Default value for SSR

  useEffect(() => {
    // Update maxVisible based on window.innerWidth after component mounts
    const handleResize = () => {
      setMaxVisible(window.innerWidth < 640 ? 3 : 5);
    };
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPaginationItems = () => {
    const items = [];
    const visiblePages = maxVisible;

    items.push(1);

    let startPage = Math.max(2, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 2);

    if (endPage - startPage < visiblePages - 2) {
      startPage = Math.max(2, endPage - (visiblePages - 2));
    }

    if (startPage > 2) {
      items.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages - 1) {
      items.push("...");
    }

    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="inline-flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`p-2 rounded-md border ${
            currentPage === 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        {getPaginationItems().map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              disabled={isLoading}
              className={`min-w-8 h-8 flex items-center justify-center px-3 rounded-md ${
                currentPage === item
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              } ${isLoading ? "cursor-not-allowed" : ""}`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`p-2 rounded-md border ${
            currentPage === totalPages || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;