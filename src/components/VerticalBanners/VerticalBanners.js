"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useEffect } from "react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

export default function VerticalBanners({ banners }) {
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
        // Sửa: bỏ max-w, set width full, height full
        <div className="mt-4 mb-0 w-full h-full mx-auto">
            {/* Desktop: Hiển thị cố định */}
            <div className="hidden md:flex flex-col justify-between h-[510px]">
                {displayBanners.map((banner, index) => (
                    // Chia đều chiều cao
                    <div key={index} className="w-full flex-1 relative mb-4 last:mb-0">
                        <Link href={banner.link || "#"} className="block w-full h-full">
                            <div className="relative w-full h-full">
                                <div className="w-full h-full relative rounded-lg overflow-hidden">
                                    <Image
                                        src={new URL(banner.url, API_BASE_URL).href}
                                        alt={banner.title || `Banner ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        quality={95}
                                        className="p-0"
                                        style={{
                                            objectFit: 'cover', // Dùng cover để ảnh không bị méo
                                            objectPosition: 'center',
                                        }}
                                        sizes="(max-width: 1200px) 30vw, 400px"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Mobile: Hiển thị slider - Giữ nguyên */}
            <div className="block md:hidden">
                <Swiper
                    spaceBetween={15}
                    slidesPerView={1}
                    loop={displayBanners.length > 1}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: ".mobile-vertical-pagination",
                    }}
                    modules={[Autoplay, Pagination]}
                    className="mobile-vertical-slider"
                    style={{ height: "180px", borderRadius: "12px" }}
                >
                    {displayBanners.map((banner, index) => (
                        <SwiperSlide key={index}>
                            <div className="w-full h-full">
                                <Link href={banner.link || "#"}>
                                    <div className="relative w-full h-full">
                                        <div className="w-full h-[180px] relative">
                                            <Image
                                                src={
                                                    banner.mobileUrl
                                                        ? new URL(banner.mobileUrl, API_BASE_URL).href
                                                        : new URL(banner.url, API_BASE_URL).href
                                                }
                                                alt={banner.title || `Banner ${index + 1}`}
                                                fill
                                                priority={index === 0}
                                                quality={95}
                                                className="object-cover rounded-lg"
                                                sizes="100vw"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* Pagination cho mobile */}
                    <div className="mobile-vertical-pagination swiper-pagination mt-3"></div>
                </Swiper>
            </div>
        </div>
    );
}