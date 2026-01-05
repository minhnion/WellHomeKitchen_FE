"use client";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { useState, useEffect } from "react";

export default function HorizontalBanners({ banners, className = "" }) {
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
        // desktop
        <div className={`w-full mx-auto py-4 ${className}`}>
            <div className="hidden md:block">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayBanners.map((banner, index) => (
                        <div key={index} className="w-full">
                            <Link href={

                                index === 0 ? "/pages/chinh-sach-bao-hanh" :
                                    index === 1 || index === 2 ? "/pages/chinh-sach-van-chuyen-lap-dat" :
                                        index === 3 ? "/pages/chinh-sach-doi-1-1" :
                                            banner.link || "#"
                            }>
                                <div className="relative w-full">
                                    <div className="w-full h-auto relative">
                                        <Image
                                            src={new URL(banner.url, API_BASE_URL).href}
                                            alt={banner.title || `Banner ${index + 1}`}
                                            width={400}
                                            height={300}
                                            priority={index === 0}
                                            quality={95}
                                            className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile: Hiển thị grid 2 cột */}
            <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-3">
                    {displayBanners.map((banner, index) => (
                        <div key={index} className="w-full">
                            <Link href={

                                index === 0 ? "/pages/chinh-sach-bao-hanh" :
                                    index === 1 || index === 2 ? "/pages/chinh-sach-van-chuyen-lap-dat" :
                                        index === 3 ? "/pages/chinh-sach-doi-1-1" :
                                            banner.link || "#"
                            }>
                                <div className="relative w-full">
                                    <div className="w-full h-auto relative">
                                        <Image
                                            src={
                                                banner.mobileUrl
                                                    ? new URL(banner.mobileUrl, API_BASE_URL).href
                                                    : new URL(banner.url, API_BASE_URL).href
                                            }
                                            alt={banner.title || `Banner ${index + 1}`}
                                            width={200}
                                            height={150}
                                            priority={index === 0}
                                            quality={95}
                                            className="w-full h-auto rounded-lg"
                                            sizes="50vw"
                                        />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}