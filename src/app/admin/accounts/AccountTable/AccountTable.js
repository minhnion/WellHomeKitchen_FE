"use client";
import { FaEdit, FaTrash } from "react-icons/fa";

const AccountTable = ({ data, handleEdit, handleDelete, page, limit }) => {
  const roleOptions = {
    user: {
      label: "Người dùng",
      class: "bg-green-100 text-green-800",
    },
    "content-creator": {
      label: "Tạo nội dung",
      class: "bg-purple-100 text-purple-800",
    },
    "product-manager": {
      label: "Quản lý sản phẩm",
      class: "bg-blue-100 text-blue-800",
    },
    admin: {
      label: "Quản trị viên",
      class: "bg-red-100 text-red-800",
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Tên người dùng
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Số điện thoại
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo và sửa đổi
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider w-32">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((account, index) => (
            <tr
              key={account._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer text-center"
                onClick={() => handleEdit(account._id)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {account.userName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{account.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">
                  {account.phoneNumber}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    roleOptions[account.role]?.class ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {roleOptions[account.role]?.label || account.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex flex-col items-center space-y-1">
                  <div className="text-xs text-gray-500">Tạo:</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(account.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500">Sửa:</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(account.updatedAt)}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(account._id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(account._id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1.5 hover:bg-red-50 rounded"
                    title="Xóa"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
