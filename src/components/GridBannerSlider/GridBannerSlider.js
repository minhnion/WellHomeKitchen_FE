"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useEffect } from "react";

export default function GridBannerSlider({ banners }) {
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

  const bannerPairs = [];
  for (let i = 0; i < banners.length; i += 2) {
    bannerPairs.push(banners.slice(i, i + 2));
  }

  return (
    <div className="my-6 relative rounded-lg overflow-hidden shadow-md w-full">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={bannerPairs.length > 1}
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
        {bannerPairs.map((pair, pairIndex) => (
          <SwiperSlide key={pairIndex}>
            <div
              className={`grid gap-4 w-full ${
                isMobile
                  ? "grid-cols-1"
                  : pair.length === 1
                  ? "grid-cols-1 max-w-1/2 mx-auto"
                  : "grid-cols-2"
              }`}
            >
              {pair.map((banner, index) => (
                <Link key={`${pairIndex}-${index}`} href={banner.link || "#"}>
                  <div className="relative w-full min-h-[200px] overflow-hidden rounded-lg">
                    <Image
                      src={
                        isMobile && banner.mobileUrl
                          ? new URL(banner.mobileUrl, API_BASE_URL).href
                          : new URL(banner.url, API_BASE_URL).href
                      }
                      alt={banner.title || `Banner ${index + 1}`}
                      fill
                      priority={pairIndex === 0 && index === 0}
                      quality={95}
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </SwiperSlide>
        ))}

        <div className="custom-pagination swiper-pagination mt-4"></div>

        {bannerPairs.length > 1 && (
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
