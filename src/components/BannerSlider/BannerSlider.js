"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useEffect } from "react";

export default function BannerSlider({ banners }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!banners || banners.length === 0) {
    return null;
  }

  const displayBanners = banners;

  return (
    // Sửa: width full, height full
    <div className="mt-4 mb-0 w-full h-full mx-auto">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={displayBanners.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="grid-banner-slider h-full"
        style={{ height: "100%" }} // Ép chiều cao full theo cha
      >
        {displayBanners.map((banner, index) => (
          <SwiperSlide key={index} className="h-full">
            <div className="w-full h-full">
              <Link href={banner.link || "#"} className="block w-full h-full">
                <div className="relative w-full h-full">
                  {/* Ảnh cho desktop */}
                  <div className="hidden md:block w-full h-full">
                    <div className="w-full h-[300px] lg:h-[510px] relative overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={new URL(banner.url, API_BASE_URL).href}
                        alt={banner.title || `Banner ${index + 1}`}
                        fill
                        priority={index === 0}
                        quality={95}
                        className="object-cover object-center" // Cover để ảnh tự cắt vừa khung
                        sizes="(max-width: 1200px) 100vw, 70vw"
                      />
                    </div>
                  </div>

                  {/* Ảnh cho mobile */}
                  <div className="block md:hidden">
                    <Image
                      src={
                        isMobile && banner.mobileUrl
                          ? new URL(banner.mobileUrl, API_BASE_URL).href
                          : new URL(banner.url, API_BASE_URL).href
                      }
                      alt={banner.title || `Banner ${index + 1}`}
                      width={800}
                      height={400}
                      priority={index === 0}
                      quality={95}
                      className="w-full h-auto object-contain rounded-lg"
                      sizes="100vw"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}

        <div className="custom-pagination swiper-pagination mt-4"></div>

        {displayBanners.length > 1 && (
          <>
            <div className="custom-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
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
            <div className="custom-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
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
      </Swiper>
    </div>
  );
}