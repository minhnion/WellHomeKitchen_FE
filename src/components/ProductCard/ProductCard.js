import React from "react";
import { API_BASE_URL } from "@/apiServices/constants";
import Link from "next/link";
import { Flame, Sparkles, Star } from "lucide-react";
import EnhancedLabel from "./EnhancedLabel";

const ProductCard = ({
  id = "",
  mainImage = "",
  slug = "",
  name = "",
  price = 0,
  discountPercent = 0,
  createdAt,
  isSpecial = false,
  subCategory,
  label = "",
  starAverage = 4.5,
  numberOfReviews = 0,
}) => {
  const truncatedTitle = name.length > 35 ? name.slice(0, 35) + "..." : name;

  const isNew =
    new Date(createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newPrice = price + (price * discountPercent) / 100;
  const truncatedOldPrice = price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const truncatedNewPrice = newPrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const star = starAverage > 0 ? starAverage : 4.5;

  return (
    <div className="flex flex-col justify-between bg-white rounded-lg shadow-md m-1 overflow-hidden w-52 aspect-[9/17] border border-gray-200 max-xl:w-48 max-sm:w-44 max-[25rem]:w-40 transition-shadow duration-300 hover:shadow-xl group">
      <Link
        href={`/san-pham/${slug}`}
        className="relative cursor-pointer block"
      >
        <div className="absolute max-sm:top-1 top-2.5 left-3 flex flex-wrap gap-1.5 z-100">
          {isSpecial && (
            <span className="max-sm:text-[9px] z-100 border border-orange-500 text-orange-500 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm flex items-center bg-white/80 backdrop-blur-sm">
              <span className="absolute -top-1.5 -left-2">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 stroke-orange-600" />
              </span>
              Nổi bật
            </span>
          )}

          {isNew && (
            <span className="max-sm:text-[9px] z-100 border border-blue-500 text-blue-500 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm flex items-center bg-white/80 backdrop-blur-sm">
              <span className="absolute -top-1.5 -left-1.75">
                <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500 stroke-blue-600" />
              </span>
              Mới
            </span>
          )}

          {discountPercent > 0 && (
            <span className="max-sm:text-[9px] z-100 border border-red-500 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm flex items-center bg-white/80 backdrop-blur-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
        <div className="relative">
          <img
            src={`${API_BASE_URL}${mainImage}`}
            alt={name}
            className="w-full h-51 object-contain z-0 max-xl:h-43 max-sm:h-40 max-[25rem]:h-33 px-4 max-sm:px-2 pt-5 pb-1 group-hover:translate-y-1 group-hover:scale-104 transition-transform duration-300 ease-out"
          />
          <div className="absolute bottom-0 left-3 transform translate-y-1/3">
            {label && <EnhancedLabel label={label} />}
          </div>
        </div>
        <div className="px-3 py-2">
          <h3
            title={name}
            className="h-10 text-base mb-2 text-gray-800 max-sm:text-[13px] max-sm:h-7"
          >
            {truncatedTitle}
          </h3>
          {subCategory ? (
            <span className="text-[11px] mb-1 text-gray-500 max-sm:text-[9px] rounded-full px-2 py-1 bg-gray-100">
              {subCategory.name}
            </span>
          ) : (
            <span className="text-xs"></span>
          )}
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-red-600 max-sm:text-lg">
              {truncatedOldPrice}
              <span className="underline">đ</span>
            </span>
            <div className="flex gap-2.5">
              {discountPercent > 0 && (
                <span className="text-sm text-gray-500 line-through max-sm:text-xs">
                  {truncatedNewPrice}
                  <span className="underline">đ</span>
                </span>
              )}
              <span className="flex items-center text-sm text-gray-500 max-sm:text-xs font-medium">
                <span className="mr-1">{star.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 max-sm:w-3 max-sm:h-3" />
                {numberOfReviews > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({numberOfReviews})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-2 pb-3 mt-auto pt-2">
        <button className="bg-primary hover:bg-blue-800 text-white font-bold w-full py-1 rounded-full text-sm transition-colors max-sm:text-[10px] cursor-pointer">
          <Link href={`/mua-hang?ids=${id}&quantitys=1`}>Mua ngay</Link>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
