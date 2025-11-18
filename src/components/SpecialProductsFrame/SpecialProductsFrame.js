"use client";

import ProductCard from "@/components/ProductCard/ProductCard";
import { FaArrowRight } from "react-icons/fa";
import { API_BASE_URL } from "@/apiServices/constants";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";

export default function SpecialProductsFrame({
  banner = null,
  products = [],
  isExtend = false,
}) {
  const bannerUrl = banner ? new URL(banner.url, API_BASE_URL).href : "";

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      {/* Banner */}
      {banner && (
        <div className="relative w-full">
          <Image
            src={bannerUrl}
            alt="Banner for categoryProduct"
            width={1200}
            height={200}
            quality={100}
            className="w-full h-auto object-cover rounded-t-lg"
          />
        </div>
      )}

      {/* Product Slider */}
      <div className="p-4 relative">
        {products.length > 0 ? (
          <Swiper
            modules={[Grid, Navigation]}
            navigation={{
              nextEl: ".special-products-next",
              prevEl: ".special-products-prev",
            }}
            grid={{
              rows: 1,
              fill: "row",
            }}
            spaceBetween={16}
            breakpoints={{
              320: { slidesPerView: 2, slidesPerGroup: 2 },
              640: { slidesPerView: 3, slidesPerGroup: 3 },
              768: { slidesPerView: 4, slidesPerGroup: 4 },
              1024: { slidesPerView: 5, slidesPerGroup: 5 },
            }}
            className="special-products-slider"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard id={product._id} {...product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>Không có sản phẩm nào trong danh mục này.</p>
          </div>
        )}

        {/* Navigation Arrows */}
        {products.length > 0 && (
          <>
            <div className="special-products-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <div className="special-products-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Extend link */}
      {isExtend && products.length > 0 && (
        <div className="mt-8 flex justify-center pb-8">
          <Link
            href={"/san-pham-dac-biet"}
            className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-blue-600 bg-white rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-medium text-xs sm:text-sm shadow-sm"
          >
            Xem thêm sản phẩm đặc biệt
            <FaArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
