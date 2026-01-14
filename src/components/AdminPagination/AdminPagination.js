"use client";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const AdminPagination = ({
  currentPage,
  totalPages,
  totalRecords,
  itemsPerPage,
  setCurrentPage,
}) => {
  const maxPagesToShow = 5; // Maximum number of page buttons to display
  const halfPagesToShow = Math.floor(maxPagesToShow / 2);

  // Calculate the range of pages to display
  let startPage = Math.max(1, currentPage - halfPagesToShow);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Adjust startPage if endPage is at the totalPages limit
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  // Generate the array of page numbers to display
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-700">
        Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
        {Math.min(currentPage * itemsPerPage, totalRecords)} của{" "}
        {totalRecords} mục
      </div>

      <div className="flex space-x-1">
        {/* First Page Button */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1
              ? "bg-gray-200 text-gray-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          <FaAngleDoubleLeft />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1
              ? "bg-gray-200 text-gray-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          <FaAngleLeft />
        </button>

        {/* Show first page and ellipsis if necessary */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-3 py-1 text-gray-700">...</span>
            )}
          </>
        )}

        {/* Page Number Buttons */}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-1 rounded ${currentPage === number
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            {number}
          </button>
        ))}

        {/* Show last page and ellipsis if necessary */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-3 py-1 text-gray-700">...</span>
            )}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-3 py-1 rounded bg-white text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Page Button */}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages
              ? "bg-gray-200 text-gray-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          <FaAngleRight />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages
              ? "bg-gray-200 text-gray-500"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;