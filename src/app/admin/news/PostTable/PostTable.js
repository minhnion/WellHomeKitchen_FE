"use client";
import Image from "next/image";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";
import { useRouter } from "next/navigation";

const PostTable = ({ data, handleDelete, page, limit }) => {
  const router = useRouter();

  const handleEditClick = (slug) => {
    router.push(`/admin/update-news?slug=${slug}`);
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      draft: {
        label: "Phát thảo",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      published: {
        label: "Xuất bản",
        className: "bg-green-100 text-green-800 border-green-200",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const getCategoryPath = (categoryHierarchy) => {
    if (!categoryHierarchy || !categoryHierarchy.length)
      return "Không có danh mục";
    return categoryHierarchy.map((cat) => cat.name).join(" > ");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bài viết
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tác giả
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thẻ
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo & sửa
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={item._id}
              className="hover:bg-gray-50 transition-colors text-xs"
            >
              <td className="px-4 py-2 whitespace-nowrap text-center">
                {(page - 1) * limit + index + 1}
              </td>

              <td
                className="px-4 py-2 whitespace-nowrap text-left cursor-pointer"
                onClick={() => handleEditClick(item.slug)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 rounded-md overflow-hidden w-10 h-10">
                    <Image
                      className="object-cover"
                      src={new URL(item.coverImage, API_BASE_URL).href}
                      alt={item.title}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-2">
                    <div
                      className="font-semibold text-gray-900 truncate max-w-[120px]"
                      title={item.title}
                    >
                      {item.title}
                    </div>
                    <div
                      className="text-gray-500 truncate max-w-[120px]"
                      title={item.excerpt}
                    >
                      {item.excerpt}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-center">
                <div className="text-xs text-gray-900">{item.author.name}</div>
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-left">
                <div
                  className="text-xs text-gray-900 truncate max-w-[120px]"
                  title={getCategoryPath(item.categoryHierarchy)}
                >
                  {getCategoryPath(item.categoryHierarchy)}
                </div>
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-center">
                {getStatusDisplay(item.status)}
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-center">
                <div
                  className="flex flex-wrap gap-1 max-h-24 overflow-y-auto px-2 py-1"
                  style={{ minWidth: 120 }}
                >
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-center">
                <div className="text-xs text-gray-900">
                  {formatDate(item.createdAt)}
                </div>
                {item.updatedAt !== item.createdAt && (
                  <div className="text-xs text-gray-400">
                    Cập nhật: {formatDate(item.updatedAt)}
                  </div>
                )}
              </td>

              <td className="px-4 py-2 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <a
                    href={`/ban-tin/${item.slug}`}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Xem trang bài viết"
                    target="_blank"
                  >
                    <FaEye className="text-sm text-gray-600" />
                  </a>
                  <button
                    onClick={() => handleEditClick(item.slug)}
                    className="p-1 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-sm text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.slug)}
                    className="p-1 hover:bg-red-50 rounded"
                    title="Xóa"
                  >
                    <FaTrash className="text-sm text-red-600" />
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

export default PostTable;
