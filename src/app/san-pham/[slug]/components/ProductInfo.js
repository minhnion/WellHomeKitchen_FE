import Link from "next/link";
import { FiPhone, FiShoppingCart, FiCreditCard } from "react-icons/fi";
import CartButtons from "./CartButton";
import { getConfigByKeyFull } from "@/apiServices/config";
import { Star } from "lucide-react";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";
import SellingPoint from "./SellingPoint";

export default async function ProductInfo({ product }) {
  const phone1 = await getConfigByKeyFull("primary-takecare");
  const phone2 = await getConfigByKeyFull("secondary-takecare");

  const { price, discountPercent, description, sku, brand } = product;

  // Calculate discounted price
  const discountedPrice = price - (price * discountPercent) / 100;

  // Format prices with commas
  const formattedOriginalPrice = price.toLocaleString("vi-VN");
  const formattedDiscountedPrice = discountedPrice.toLocaleString("vi-VN");

  const formattedPhone1 =
    phone1?.value?.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") || "Không có";
  const formattedPhone2 =
    phone2?.value?.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3") || "Không có";

  const star = product?.starAverage ? product?.starAverage : 4.5;

  return (
    <div className="flex flex-col h-full">
      {/* Brand and sku */}
      {brand && (
        <div className="mb-4 max-sm:mb-3">
          <div className="flex flex-wrap items-center gap-2 max-sm:text-sm">
            <div className="flex items-center">
              <span className="text-gray-500 whitespace-nowrap">Mã sản phẩm: </span>
              <span className="text-blue-800 hover:text-blue-800 font-medium ml-1 truncate max-sm:max-w-[200px]">
                {sku}
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-gray-500 whitespace-nowrap">Thương hiệu: </span>
              <span className="text-blue-800 hover:text-blue-800 font-medium ml-1 truncate max-sm:max-w-[120px]">
                {brand.name}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-cols gap-5">
        <div className="md:w-2/3">
          {/* Price section */}

          <div className="mb-6 bg-gray-100 rounded-lg max-sm:mb-4 max-sm:rounded-md">
            <div className="py-3 px-4 max-sm:py-2 max-sm:px-3">

              <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-start max-sm:gap-2">

                <span className="font-semibold text-gray-700 max-sm:text-sm whitespace-nowrap">Giá:</span>


                <div className="flex items-center gap-3 max-sm:gap-2 max-sm:flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-red-600 max-sm:text-xl">
                    {formattedDiscountedPrice}₫
                  </span>

                  <span className="line-through text-gray-500 text-base sm:text-lg max-sm:text-sm">
                    {formattedOriginalPrice}₫
                  </span>

                  {discountPercent > 0 && (
                    <span className="px-2 py-1 bg-white text-red-600 text-xs sm:text-sm font-medium rounded-md border border-red-300 max-sm:text-xs max-sm:px-1.5 max-sm:py-0.5 whitespace-nowrap">
                      -{discountPercent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>



          {/* Action buttons */}
          <CartButtons product={product} />
          {/* Short description */}
          {description && (
            <div className="mb-6 max-sm:mb-4">
              <div
                className="text-gray-700 prose prose-sm max-w-none
              prose-headings:text-gray-800 prose-headings:font-semibold
              prose-h1:text-lg sm:prose-h1:text-lg prose-h1:text-base
              prose-h2:text-base sm:prose-h2:text-base prose-h2:text-sm
              prose-h3:text-sm sm:prose-h3:text-sm prose-h3:text-xs
              prose-p:mb-2 prose-p:leading-snug max-sm:prose-p:text-sm
              prose-ul:list-disc prose-ul:pl-6 prose-ul:my-2
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-2
              prose-li:my-1 prose-li:leading-snug prose-li:pl-1 max-sm:prose-li:text-sm
              prose-strong:text-gray-800 prose-strong:font-semibold
              prose-em:text-gray-700 prose-em:italic
              prose-img:rounded-lg prose-img:shadow-sm prose-img:my-3 max-sm:prose-img:my-2
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:space-y-1
              [&_li]:leading-snug [&_li]:text-gray-700 max-sm:[&_li]:text-sm
              [&_p]:mb-2 [&_p]:leading-snug max-sm:[&_p]:text-sm
              [&_h1]:text-lg sm:[&_h1]:text-lg [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-gray-800 [&_h1]:mb-2
              [&_h2]:text-base sm:[&_h2]:text-base [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-gray-800 [&_h2]:mb-2
              [&_h3]:text-sm sm:[&_h3]:text-sm [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mb-2
              [&_strong]:font-semibold [&_strong]:text-gray-800
              [&_em]:italic [&_em]:text-gray-700
              [&_img]:rounded-lg [&_img]:shadow-sm [&_img]:my-3 max-sm:[&_img]:my-2 [&_img]:max-w-full [&_img]:h-auto"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}

        </div>
        <div className="md:w-1/3">
          <SellingPoint />
        </div>
      </div>
    </div>

  );
}