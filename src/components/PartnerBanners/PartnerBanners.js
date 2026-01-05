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

    const allItems = [
        { isTitleBox: true, id: "title-box" },
        ...displayBanners
    ];

    return (
        <div className={`w-full max-w-6xl mx-auto py-8 ${className}`}>
            <div className="flex w-full">
                {allItems.map((item, index) => {
                    const width = `${100 / allItems.length}%`;

                    if (item.isTitleBox) {
                        return (
                            <div
                                key={item.id}
                                style={{ width }}
                                className="flex items-center justify-center h-40 bg-white text-black border border-gray-100"
                            >
                                <span className="font-bold text-center">Đối tác của Bepanphu</span>
                            </div>
                        );
                    }

                    // Banner bình thường với title đè lên ảnh
                    return (
                        <div
                            key={item.id || index}
                            style={{ width }}
                            className="relative h-40 border border-gray-100 bg-white"
                        >
                            <Link href={item.link || "#"} className="w-full h-full block relative group">
                                <Image
                                    src={new URL(item.url, API_BASE_URL).href}
                                    alt={item.title || partnerNames[index - 1] || `Đối tác ${index}`}
                                    width={150}
                                    height={100}
                                    className="w-full h-full object-contain"
                                />
                                {/* Title đè lên ảnh */}
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-900
                                 group-hover:text-red-500 transition-colors">
                                    {item.title || partnerNames[index - 1] || `Đối tác ${index}`}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
