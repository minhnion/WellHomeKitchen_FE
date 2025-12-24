"use client";

import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";

export default function ProductRowCard({
    slug = "",
    name = "",
    mainImage = "",
    price = 0,
    discountPercent = 0,
}) {
    const oldPrice = price;
    const newPrice = price + (price * discountPercent) / 100;

    const formatPrice = (p) =>
        p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return (
        <Link
            href={`/san-pham/${slug}`}
            className="
        flex items-center gap-4
        p-4
        h-[150px]
        hover:bg-gray-50
        transition
      "
        >
            {/* IMAGE */}
            <div className="w-28 h-full flex-shrink-0">
                <img
                    src={`${API_BASE_URL}${mainImage}`}
                    alt={name}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* INFO */}
            <div className="flex flex-col justify-between flex-1 h-full">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                    {name}
                </h3>

                <div>
                    <div className="text-lg font-bold text-red-600">
                        {formatPrice(oldPrice)}đ
                    </div>

                    {discountPercent > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(newPrice)}đ
                            </span>
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                                -{discountPercent}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
