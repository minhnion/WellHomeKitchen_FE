"use client";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";

const BannerTable = ({ banners, handleEdit, handleDelete, page, limit }) => {
  const typeOptions = {
    "slider-full": {
      label: "Rộng toàn màn hình",
      class: "bg-blue-100 text-blue-800",
    },
    "slider-part": {
      label: "Rộng một phần màn hình",
      class: "bg-purple-100 text-purple-800",
    },
  };

  const statusOptions = {
    true: { label: "Hiển thị", class: "bg-green-100 text-green-800" },
    false: { label: "Tạm ẩn", class: "bg-red-100 text-red-800" },
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">STT</th>
            <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
              Banner
            </th>
            <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
              Số thứ tự ưu tiên
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Hình ảnh desktop
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Hình ảnh mobile
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
              Phân loại & Trạng thái
            </th>
            <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider w-32">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {banners.map((banner, index) => (
            <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleEdit(banner._id)}
              >
                <div className="flex flex-col items-start">
                  <div className="text-sm font-medium text-gray-900">
                    {banner.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    Link tới trang: {banner.link}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="text-sm font-medium text-gray-900">
                  {banner.priority}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex justify-center">
                  <div className="relative w-full aspect-[18/3] rounded-md overflow-hidden">
                    <Image
                      className="object-cover"
                      src={new URL(banner.url, API_BASE_URL).href}
                      alt={`${banner.title} banner`}
                      fill
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {banner.mobileUrl && (
                  <div className="flex justify-center">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        className="object-cover"
                        src={new URL(banner.mobileUrl, API_BASE_URL).href}
                        alt={`${banner.title} mobile banner`}
                        fill
                      />
                    </div>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex flex-col items-center space-y-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      typeOptions[banner.type]?.class ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {typeOptions[banner.type]?.label || banner.type}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusOptions[banner.isShow]?.class ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusOptions[banner.isShow]?.label || banner.isShow}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(banner._id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1.5 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
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

export default BannerTable;
