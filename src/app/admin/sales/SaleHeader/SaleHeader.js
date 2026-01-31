"use client";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

const SaleHeader = ({
    searchTerm,
    setSearchTerm,
    itemsPerPage,
    setItemsPerPage,
    status,
    setStatus,
    onCreate,
}) => {
    const [inputValue, setInputValue] = useState(searchTerm);

    // sync input khi reset
    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    // debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            setSearchTerm(inputValue);
        }, 300);
        return () => clearTimeout(delay);
    }, [inputValue, setSearchTerm]);

    return (
        <>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                {/* SEARCH */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm đợt sale"
                        className="pl-8 pr-3 py-1.5 rounded-lg w-64 text-sm border"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <FaSearch className="absolute left-2 top-2 text-gray-400 text-sm" />
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex gap-75">
                    {/* STATUS FILTER */}
                    <select
                        className="border rounded-lg px-3 py-1.5 text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="upcoming">Chưa diễn ra</option>
                        <option value="active">Đang diễn ra</option>
                        <option value="ended">Đã kết thúc</option>
                    </select>

                    {/* ITEMS PER PAGE */}
                    <select
                        className="border rounded-lg px-3 py-1.5 text-sm"
                        value={itemsPerPage}
                        onChange={(e) =>
                            setItemsPerPage(Number(e.target.value))
                        }
                    >
                        <option value={10}>10 / trang</option>
                        <option value={20}>20 / trang</option>
                        <option value={50}>50 / trang</option>
                    </select>

                    <button
                        onClick={onCreate}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded text-sm"
                    >
                        <FaPlus size={12} />
                        Tạo sale
                    </button>
                </div>
            </div>

            {/* ACTIVE FILTER TAG */}
            {(searchTerm || status !== "all") && (
                <div className="mb-3 flex flex-wrap gap-2 text-sm">
                    <span className="text-gray-600">
                        Bộ lọc đang áp dụng:
                    </span>

                    {searchTerm && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                            Từ khóa: {searchTerm}
                            <button
                                onClick={() => setSearchTerm("")}
                                className="ml-1 w-4 h-4 text-blue-500 hover:bg-blue-200 rounded-full"
                            >
                                ×
                            </button>
                        </span>
                    )}

                    {status !== "all" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                            Trạng thái: {status}
                            <button
                                onClick={() => setStatus("all")}
                                className="ml-1 w-4 h-4 text-green-600 hover:bg-green-200 rounded-full"
                            >
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </>
    );
};

export default SaleHeader;
