"use client";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";

const CategoryTable = ({
  categories,
  handleEdit,
  handleDelete,
  page,
  limit,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Số thứ tự ưu tiên
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Banner danh mục
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Tổng sản phẩm
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider w-32">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category, index) => (
            <tr
              key={category._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleEdit(category._id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      className="h-full w-full object-cover"
                      src={new URL(category.imageUrl, API_BASE_URL).href}
                      alt={category.name}
                      width={56}
                      height={56}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Slug name: {category.slug}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900">
                  {category.priority}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center">
                  <div className="relative w-full aspect-[18/3] rounded-md overflow-hidden">
                    <Image
                      className="object-cover"
                      src={new URL(category.bannerUrl, API_BASE_URL).href}
                      alt={`${category.name} banner`}
                      fill
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900">
                  {category.productCount || 0}
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
                    onClick={() => handleDelete(category._id)}
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

export default CategoryTable;
