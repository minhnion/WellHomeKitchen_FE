"use client";
import Image from "next/image";
import { FaComments, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";
import { formatPrice } from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ProductTable = ({ products, handleDelete, page, limit }) => {
  const router = useRouter();
  const handleEdit = (sku) => {
    router.push(`/admin/update-product?sku=${sku}`);
  };
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
              Sản phẩm
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phân loại
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thương hiệu
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá & Giảm giá
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Đã bán
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr
              key={product._id}
              className="hover:bg-gray-50 transition-colors text-xs"
            >
              <td className="px-4 py-2 ">{(page - 1) * limit + index + 1}</td>
              <td
                className="px-4 py-2 cursor-pointer max-w-[200px]"
                onClick={() => handleEdit(product.sku)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 rounded-md overflow-hidden w-10 h-10">
                    <Image
                      className="object-cover"
                      src={new URL(product.mainImage, API_BASE_URL).href}
                      alt={product.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-2 min-w-0 flex-1">
                    <div
                      className="font-semibold text-gray-900 break-words leading-tight"
                      title={product.name}
                    >
                      {product.name}
                    </div>
                    {/* <div className="text-gray-500 break-words leading-tight mt-1">
                      {product.description}
                    </div> */}
                  </div>
                </div>
              </td>
              <td className="px-4 py-2  text-center">
                {product.category?.name || ""}
              </td>
              <td className="px-4 py-2  text-center">
                {product.subCategory?.name || ""}
              </td>
              <td className="px-4 py-2  text-center">
                {product.brand?.name || ""}
              </td>
              <td className="px-4 py-2  text-center">{product.sku || ""}</td>
              <td className="px-4 py-2  text-center">
                <div className="font-medium text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {product.discountPercent != null && (
                  <div className="mt-1 inline-block px-2 py-0.5 text-[0.6rem] font-semibold text-green-700 bg-green-100 rounded-full">
                    {product.discountPercent.toFixed(2)}%
                  </div>
                )}
              </td>
              <td className="px-4 py-2  text-center">
                {product.quantitySold || 0}
              </td>
              <td className="px-4 py-2  text-center">
                <div className="flex justify-center space-x-2">
                  <a
                    href={`/san-pham/${product.slug}`}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Xem trang sản phẩm"
                    target="_blank"
                  >
                    <FaEye className="text-sm text-gray-600" />
                  </a>
                  <Link
                    href={`/admin/reviews-and-comments?productId=${product._id}`}
                    title="Xem đánh giá và bình luận"
                    className="p-1 hover:bg-green-50 rounded inline-flex items-center"
                  >
                    <FaComments className="text-sm text-green-600	" />
                  </Link>
                  <button
                    onClick={() => handleEdit(product.sku)}
                    className="p-1 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <FaEdit className="text-sm text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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

export default ProductTable;
