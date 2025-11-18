import Link from "next/link";
import { FiPhone, FiShoppingCart, FiCreditCard } from "react-icons/fi";
import CartButtons from "./CartButton";
import { getConfigByKeyFull } from "@/apiServices/config";
import { Star } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";
export default async function ProductInfo({ product }) {
  const phone1 = await getConfigByKeyFull("primary-takecare");
  const phone2 = await getConfigByKeyFull("secondary-takecare");
  console.log(phone1, phone2);
  const { price, discountPercent, description, sku, brand } = product;

  // Calculate discounted price
  const newPrice = price + (price * discountPercent) / 100;

  // Format prices with commas
  const formattedOriginalPrice = price.toLocaleString("vi-VN");
  const formattedDiscountedPrice = newPrice.toLocaleString("vi-VN");

  const formattedPhone1 =
    phone1?.value?.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") || "Không có";
  const formattedPhone2 =
    phone2?.value?.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") || "Không có";

  const star = product?.starAverage ? product?.starAverage : 4.5;

  return (
    <div className="flex flex-col h-full">
      {/* Price section */}
      <div className="mb-6">
        <div className="flex items-center">
          {discountPercent > 0 && (
            <span className="line-through text-gray-500 text-lg mr-2">
              {formattedDiscountedPrice}₫
            </span>
          )}
          <span className="text-3xl font-bold text-red-600">
            {formattedOriginalPrice}₫
          </span>
          {discountPercent > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-md">
              -{discountPercent}%
            </span>
          )}
          <span className="flex items-center text-sm text-gray-500 max-sm:text-xs ml-2 font-medium">
            <span className="mr-1">{star.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 max-sm:w-3 max-sm:h-3" />
            {product.numberOfReviews > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.numberOfReviews})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Brand */}
      {brand && (
        <div className="mb-4">
          <span className="text-gray-500">Thương hiệu: </span>
          {/* <Link
            href={`/thuong-hieu/${brand?._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {brand.name}
          </Link> */}
          <Image
            src={new URL(brand.imageUrl, API_BASE_URL).href}
            alt={brand?.name || "Brand Logo"}
            width={100}
            height={50}
            className="inline-block object-contain max-h-12"
          />
        </div>
      )}

      {/* Short description */}
      {description && (
        <div
          className="text-gray-700 prose prose-sm max-w-none
        prose-headings:text-gray-800 prose-headings:font-semibold
        prose-h1:text-lg prose-h2:text-base prose-h3:text-sm
        prose-p:mb-2 prose-p:leading-snug
        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-2
        prose-li:my-1 prose-li:leading-snug prose-li:pl-1
        prose-strong:text-gray-800 prose-strong:font-semibold
        prose-em:text-gray-700 prose-em:italic
        prose-img:rounded-lg prose-img:shadow-sm prose-img:my-3
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:space-y-1
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:space-y-1
        [&_li]:leading-snug [&_li]:text-gray-700
        [&_p]:mb-2 [&_p]:leading-snug
        [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-gray-800 [&_h1]:mb-2
        [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mb-2
        [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-2
        [&_strong]:font-semibold [&_strong]:text-gray-800
        [&_em]:italic [&_em]:text-gray-700
        [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:my-3 [&_img]:max-w-full [&_img]:h-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Action buttons */}
      <CartButtons product={product} />

      {/* Contact section */}
      <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="font-medium mb-2">Liên hệ tư vấn mua hàng:</p>
        <div className="flex items-center mb-2">
          <FiPhone className="text-red-500 mr-2" />
          <a
            href={`tel:${formattedPhone1}`}
            className="text-red-500 font-bold text-l max-sm:text-sm"
          >
            {formattedPhone1}
          </a>
          <span className="text-sm ml-2">{phone1.other}</span>
        </div>
        <div className="flex items-center">
          <FiPhone className="text-red-500 mr-2" />
          <a
            href={`tel:${formattedPhone2}`}
            className="text-red-500 font-bold text-l max-sm:text-sm"
          >
            {formattedPhone2}
          </a>
          <span className="text-sm ml-2">{phone2.other}</span>
        </div>
      </div>

      {/* Show room */}
      {/* <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="font-medium text-gray-800 mb-2">SHOWROOM HÀ NỘI:</p>
        <p className="text-gray-500 text-sm">
          106 Nguyễn Khánh Toàn – Cầu Giấy – Hà Nội
        </p>
        <p className="text-gray-500 text-sm">
          94 Đường Láng - Thịnh Quang - Đống Đa - Hà Nội
        </p>
      </div> */}
      {/* Why choose us */}
      {/* <div className="mt-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="font-medium text-gray-800 mb-2">
          TẠI SAO NÊN CHỌN CHÚNG TÔI:
        </p>
        <div className="space-y-2">
          <div className="flex items-start">
            <FiShoppingCart className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Nhà phân phối chính hãng các thương hiệu uy tín: Bosch, Teka,
              Cata, Chefs, Munchen
            </p>
          </div>
          <div className="flex items-start">
            <svg
              className="text-blue-500 mt-1 mr-2 h-4 w-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <p className="text-sm text-gray-600">
              Dịch vụ bảo hành chính hãng và hỗ trợ kỹ thuật sau bán hàng
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
