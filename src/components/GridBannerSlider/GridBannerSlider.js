"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

  return (
    <div className="my-6 relative rounded-lg overflow-hidden shadow-md w-full">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
        loop={banners.length > 3}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="grid-banner-slider"
      >
        {bannerPairs.map((pair, pairIndex) => (
          <SwiperSlide key={pairIndex}>
            <div
              className={`grid gap-4 w-full ${isMobile
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
      </Swiper>

      <style jsx global>{`
        .grid-banner-slider .swiper-button-next,
        .grid-banner-slider .swiper-button-prev {
          background: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #1f2937;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .grid-banner-slider .swiper-button-next:hover,
        .grid-banner-slider .swiper-button-prev:hover {
          background: white;
          transform: scale(1.1);
        }

        .grid-banner-slider .swiper-button-next::after,
        .grid-banner-slider .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        .grid-banner-slider .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
        }

        .grid-banner-slider .swiper-pagination-bullet-active {
          background: #263b96;
        }
      `}</style>
    </div>
  );
}
