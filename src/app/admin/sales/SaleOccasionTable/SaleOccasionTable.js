import { FaEdit, FaTrash } from "react-icons/fa";

const SaleOccasionTable = ({ data, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            STT
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">
                            Tên đợt sale
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Slug
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Bắt đầu
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Kết thúc
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Số SP
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-28">
                            Hành động
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((sale, index) => (
                        <tr
                            key={sale._id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-4 py-3 text-center">
                                {index + 1}
                            </td>

                            <td className="px-4 py-3 font-semibold text-gray-900">
                                {sale.name}
                            </td>

                            <td className="px-4 py-3 text-center text-gray-600">
                                {sale.slug}
                            </td>

                            <td className="px-4 py-3 text-center">
                                {new Date(sale.startAt).toLocaleDateString("vi-VN")}

                            </td>

                            <td className="px-4 py-3 text-center">
                                {new Date(sale.endAt).toLocaleDateString("vi-VN")}

                            </td>

                            <td className="px-4 py-3 text-center">
                                {sale.products?.length || 0}
                            </td>

                            <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(sale)}
                                        className="p-1 rounded hover:bg-blue-50 text-blue-600"
                                        title="Chỉnh sửa"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        onClick={() => onDelete(sale._id)}
                                        className="p-1 rounded hover:bg-red-50 text-red-600"
                                        title="Xóa"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {!data.length && (
                        <tr>
                            <td
                                colSpan={7}
                                className="py-8 text-center text-gray-400"
                            >
                                Chưa có đợt sale nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SaleOccasionTable;
