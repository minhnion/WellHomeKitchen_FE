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
        <div className="mt-6 mb-0 w-full max-w-[400px] mx-auto">
            {/* Desktop: Hiển thị cố định */}
            <div className="hidden md:block">
                <div className="flex flex-col gap-4">
                    {displayBanners.map((banner, index) => (
                        <div key={index} className="w-full">
                            <Link href={banner.link || "#"}>
                                <div className="relative w-full">
                                    <div className="w-full h-[189px] relative">
                                        <Image
                                            src={new URL(banner.url, API_BASE_URL).href}
                                            alt={banner.title || `Banner ${index + 1}`}
                                            fill
                                            priority={index === 0}
                                            quality={95}
                                            className="object-cover rounded-lg shadow-lg"
                                            sizes="400px"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile: Hiển thị slider */}
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