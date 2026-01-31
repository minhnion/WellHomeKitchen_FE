"use client";
import { toast } from "react-toastify";
import { useEffect, useState, useMemo } from "react";
import SaleOccasionTable from "./SaleOccasionTable/SaleOccasionTable";
import CreateModal from "@/components/CreateModal/CreateModal";
import { UpdateModal } from "@/components/UpdateModal/UpdateModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal/DeleteConfirmationModal";
import { saleOccasionFields } from "./saleOccasionFields/saleOccasionFields";
import AdminPagination from "@/components/AdminPagination/AdminPagination";
import SaleHeader from "./SaleHeader/SaleHeader";
import {
    getAllSaleOccasions,
    createSaleOccasion,
    updateSaleOccasion,
    deleteSaleOccasion,
} from "@/apiServices/saleOccasion";

export default function SaleOccasionPage() {
    /* ================= STATE ================= */
    const [data, setData] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [status, setStatus] = useState("all");

    /* ================= FETCH ================= */
    const fetchData = async () => {
        try {
            const res = await getAllSaleOccasions();
            setData(res?.sales || []);

        } catch (error) {
            console.error("Fetch sale occasions error:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /* ================= SEARCH FILTER ================= */
    const filteredData = useMemo(() => {
        let result = data;

        // search theo tên
        if (searchTerm) {
            result = result.filter((item) =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // filter theo trạng thái
        if (status !== "all") {
            const now = new Date();

            result = result.filter((item) => {
                const start = new Date(item.startAt);
                const end = new Date(item.endAt);

                if (status === "upcoming") return now < start;
                if (status === "active") return now >= start && now <= end;
                if (status === "ended") return now > end;

                return true;
            });
        }

        return result;
    }, [data, searchTerm, status]);


    /* ================= RESET PAGE ================= */
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage, data]);

    /* ================= PAGINATION ================= */
    const totalRecords = filteredData.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    /* ================= RENDER ================= */
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* HEADER */}
            <SaleHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setStatus={setStatus}
                onCreate={() => setOpenCreate(true)}
            />

            {/* TABLE */}
            <SaleOccasionTable
                data={paginatedData}
                onEdit={(item) => {
                    setEditing({
                        ...item,
                        sales: item.products.map((p) => ({
                            productId: p.productId
                                ? {
                                    value: p.productId._id || p.productId,
                                    label: p.productId.name || "Sản phẩm",
                                }
                                : null,
                            salePercent: p.salePercent,
                            saleQuantity: p.saleQuantity,
                        })),
                    });
                }}
                onDelete={(id) => {
                    setDeleteId(id);
                    setOpenDelete(true);
                }}
            />

            {/* PAGINATION */}
            {totalPages >= 1 && (
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                />
            )}

            {/* CREATE */}
            <CreateModal
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
                title="Tạo đợt sale"
                fields={saleOccasionFields}
                onSave={async (payload) => {
                    try {
                        await createSaleOccasion(payload);
                        toast.success("Tạo đợt sale thành công");
                        setOpenCreate(false);
                        fetchData();
                    } catch (err) {
                        toast.error(
                            err?.response?.data?.message ||
                            "Tạo đợt sale thất bại"
                        );
                    }
                }}
            />

            {/* UPDATE */}
            {editing && (
                <UpdateModal
                    isOpen={!!editing}
                    onClose={() => setEditing(null)}
                    title="Cập nhật đợt sale"
                    fields={saleOccasionFields}
                    initialData={editing}
                    onUpdate={async (payload) => {
                        try {
                            const res = await updateSaleOccasion(
                                editing._id,
                                payload
                            );
                            toast.success(
                                res?.message ||
                                "Cập nhật đợt sale thành công"
                            );
                            setEditing(null);
                            fetchData();
                        } catch (err) {
                            toast.error(
                                err?.response?.data?.message ||
                                "Cập nhật thất bại"
                            );
                        }
                    }}
                />
            )}

            {/* DELETE */}
            <DeleteConfirmationModal
                isOpen={openDelete}
                onClose={() => {
                    setOpenDelete(false);
                    setDeleteId(null);
                }}
                title="Bạn có chắc muốn xóa đợt sale này?"
                onConfirm={async () => {
                    try {
                        await deleteSaleOccasion(deleteId);
                        toast.success("Xóa đợt sale thành công");
                        setOpenDelete(false);
                        setDeleteId(null);
                        fetchData();
                    } catch (err) {
                        toast.error(
                            err?.response?.data?.message ||
                            "Không thể xóa đợt sale"
                        );
                    }
                }}
            />
        </div>
    );
}
