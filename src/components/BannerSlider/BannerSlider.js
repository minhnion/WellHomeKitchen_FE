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
    <div className="mt-6 mb-0 w-full max-w-full md:max-w-[747px] mx-auto ">
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
        className="grid-banner-slider"
        style={{ height: "auto" }}
      >
        {displayBanners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="w-full">
              <Link href={banner.link || "#"}>
                <div className="relative w-full">
                  {/* Ảnh cho desktop - kích thước cố định 747x510 */}
                  <div className="hidden md:block mx-auto">
                    <div className="w-[747px] h-[510px] relative overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={new URL(banner.url, API_BASE_URL).href}
                        alt={banner.title || `Banner ${index + 1}`}
                        fill
                        priority={index === 0}
                        quality={95}
                        className="object-cover object-top" // Hiển thị phần TOP của ảnh
                        sizes="747px"
                      />
                    </div>
                  </div>

                  {/* Ảnh cho mobile - full width, hiển thị toàn bộ */}
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
                      className="w-full h-auto object-contain"
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