"use client";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";

const BrandTable = ({ brands, handleEdit, handleDelete, page, limit }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
              Thương hiệu
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
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
          {brands.map((brand, index) => (
            <tr key={brand._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleEdit(brand._id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      className="object-cover"
                      src={new URL(brand.imageUrl, API_BASE_URL).href}
                      alt={brand.name}
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {brand.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Slug name: {brand.slug}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div
                  className="flex flex-wrap gap-1 max-h-24 overflow-y-auto px-2 py-1"
                  style={{ minWidth: 120 }}
                >
                  {brand.categoryIds.map((cat) => (
                    <span
                      key={cat._id}
                      className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900">
                  {brand.productCount || 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(brand._id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
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

export default BrandTable;
