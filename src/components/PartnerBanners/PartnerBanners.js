"use client";
import Image from "next/image";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";

export default function PartnerBanners({ banners, className = "" }) {
    if (!banners || banners.length === 0) return null;

    const partnerNames = [
        "MBBank", "Techcombank", "VPBank", "VIB",
        "KienlongBank", "VNShop", "LynkID"
    ];

    const filteredBanners = banners
        .filter(b => Number(b.priority) >= 5 && Number(b.priority) <= 11)
        .sort((a, b) => Number(a.priority) - Number(b.priority))
        .slice(0, 7);

    const displayBanners = filteredBanners.length > 0 ? filteredBanners : banners.slice(0, 7);

    return (
        <div className={`w-full mx-auto py-8 ${className}`}>
            {/* Mobile: tiêu đề riêng */}
            <h2 className="text-lg font-bold text-left mb-4  sm:hidden">
                Đối tác của Bepanphu
            </h2>

            <div className="flex overflow-x-auto sm:flex-wrap sm:w-full">
                {/* Desktop card đầu */}
                <div className="hidden sm:flex sm:flex-shrink-0 sm:w-40 sm:h-40 sm:items-center sm:justify-center sm:border sm:border-gray-100 sm:bg-white  relative">
                    <span className="font-bold text-center">Đối tác của Bepanphu</span>
                </div>

                {/* Các partner */}
                {displayBanners.map((item, index) => (
                    <div
                        key={item.id || index}
                        className="flex-shrink-0 w-40 h-40 relative border border-gray-100 bg-white flex items-center justify-center mx-0 my-0  sm:flex-auto sm:w-auto sm:h-auto"
                    >
                        <Link
                            href={item.link || "#"}
                            className="w-full h-full block relative group flex items-center justify-center"
                        >
                            <Image
                                src={new URL(item.url, API_BASE_URL).href}
                                alt={item.title || partnerNames[index] || `Đối tác ${index}`}
                                width={150}
                                height={150}
                                className="max-w-[60%] max-h-[60%] object-contain transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Title partner (desktop) */}
                            <span
                                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-900
                           sm:text-xs xs:text-[10px]
                           group-hover:text-red-500 transition-colors
                           whitespace-nowrap
                           sm:block hidden"
                            >
                                {item.title || partnerNames[index] || `Đối tác ${index}`}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
