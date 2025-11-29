"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useEffect } from "react";

import "swiper/css";
import "swiper/css/pagination";

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

  return (
    <div className="mb-6 relative rounded-lg overflow-hidden shadow-md h-full">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="banner-slider"
        autoHeight={true}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={banner.link}>
              <div className="relative h-full aspect-[3/2]">
                <Image
                  src={
                    isMobile && banner.mobileUrl
                      ? new URL(banner.mobileUrl, API_BASE_URL).href
                      : new URL(banner.url, API_BASE_URL).href
                  }
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  quality={95}
                  className="object-cover"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
