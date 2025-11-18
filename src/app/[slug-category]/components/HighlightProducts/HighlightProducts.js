"use client";

import { API_BASE_URL } from "@/apiServices/constants";
import ProductCard from "@/components/ProductCard/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";

export const HighlightProducts = ({ products, banner = null }) => {
  const bannerUrl = banner ? new URL(banner, API_BASE_URL).href : "";

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#3DBEFF] shadow-md rounded-lg mt-6 overflow-hidden">
      {/* Banner */}
      {banner && (
        <div className="relative w-full">
          <img
            src={bannerUrl}
            alt="Highlight Banner"
            className="w-full h-auto object-cover rounded-t-lg"
          />
        </div>
      )}

      <div className="p-4 relative">
        <Swiper
          modules={[Grid, Navigation]}
          navigation={{
            nextEl: ".highlight-products-next",
            prevEl: ".highlight-products-prev",
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
          className="highlight-products-slider"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard id={product._id} {...product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="highlight-products-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
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

        <div className="highlight-products-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
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
      </div>
    </div>
  );
};
