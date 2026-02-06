import Link from "next/link";
import CartButtons from "./CartButton";
import { getConfigByKeyFull } from "@/apiServices/config";
import SellingPoint from "./SellingPoint";

export default async function ProductInfo({ product }) {
  const phone1 = await getConfigByKeyFull("primary-takecare");
  const phone2 = await getConfigByKeyFull("secondary-takecare");

  const { price, discountPercent, description, sku, brand } = product;

  const discountedPrice = price - (price * discountPercent) / 100;

  const formattedOriginalPrice = price.toLocaleString("vi-VN");
  const formattedDiscountedPrice = discountedPrice.toLocaleString("vi-VN");

  return (
    <div className="flex flex-col h-full">
      {/* Brand + SKU */}
      {brand && (
        <div className="mb-4 max-sm:mb-3">
          <div className="flex flex-wrap items-center gap-2 max-sm:text-sm">
            <div className="flex items-center">
              <span className="text-gray-500">Mã sản phẩm:</span>
              <span className="ml-1 text-blue-800 font-medium truncate max-sm:max-w-[200px]">
                {sku}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500">Thương hiệu:</span>
              <span className="ml-1 text-blue-800 font-medium truncate max-sm:max-w-[120px]">
                {brand.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* LEFT */}
        <div className="md:w-2/3 flex flex-col">

          {/* PRICE */}
          <div className="order-1 md:order-none">
            <div className="mb-4 bg-gray-100 rounded-lg">
              <div className="py-3 px-4 max-sm:py-2 max-sm:px-3">

                {/* DESKTOP */}
                <div className="hidden md:flex items-center gap-3">
                  <span className="font-semibold text-gray-700">Giá:</span>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-3xl font-bold text-red-600">
                      {formattedDiscountedPrice}₫
                    </span>

                    <span className="line-through text-gray-500">
                      {formattedOriginalPrice}₫
                    </span>

                    {discountPercent > 0 && (
                      <span className="px-2 py-1 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md">
                        -{discountPercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* MOBILE */}
                <div className="flex md:hidden items-center gap-2 flex-wrap">
                  <span className="text-xl font-bold text-red-600">
                    {formattedDiscountedPrice}₫
                  </span>

                  <span className="line-through text-sm text-gray-500">
                    {formattedOriginalPrice}₫
                  </span>

                  {discountPercent > 0 && (
                    <span className="px-1.5 py-0.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded">
                      -{discountPercent.toFixed(2)}%
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>


          {/* CART BUTTONS (below price on mobile) */}
          <div className="order-2 md:order-none">
            <CartButtons product={product} />
          </div>

          {/* DESCRIPTION (last on mobile) */}
          {description && (
            <div className="order-4 md:order-none mb-6">
              <div
                className="text-gray-700 prose prose-sm max-w-none
                prose-headings:text-gray-800
                prose-p:leading-snug
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                prose-img:rounded-lg prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          )}
        </div>

        {/* RIGHT – Selling Point */}
        <div className="md:w-1/3 order-3 md:order-none">
          <SellingPoint />
        </div>
      </div>
    </div>
  );
}
