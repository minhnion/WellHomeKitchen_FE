"use client";
import { FaEdit, FaTrash } from "react-icons/fa";

const PostCategoryTable = ({ data, handleEdit, handleDelete, page, limit }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Tên danh mục
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Danh mục cha
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider w-32">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((category, index) => (
            <tr
              key={category._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-center cursor-pointer"
                onClick={() => handleEdit(category._id)}
              >
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{category.slug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">
                  {category.parent ? category.parent.name : "Gốc"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(category._id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.slug)}
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

export default PostCategoryTable;
