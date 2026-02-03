"use client";

import ProductCard from "../ProductCard/ProductCard";
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

const SaleOccasionProductFrame = ({ sale, products = [] }) => {
    const swiperRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState(null);

    if (!sale || products.length === 0) return null;

    useEffect(() => {
        if (!sale?.endAt) return;

        const updateCountdown = () => {
            const now = new Date().getTime();
            const end = new Date(sale.endAt).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [sale?.endAt]);

    return (
        <div className="bg-[#2B3E99] rounded-xl p-3 sm:p-5 relative my-5">
            {/* ===== Header ===== */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg w-full overflow-hidden">

                    <span className="w-3 h-3 rounded-full bg-white" />
                    <span className="truncate max-w-[140px] sm:max-w-none">
                        {sale.name}
                    </span>


                    {timeLeft && (
                        <div className="flex gap-1 text-[10px] sm:text-xs font-semibold flex-shrink-0">

                            {[
                                { label: "Ngày", value: timeLeft.days },
                                { label: "Giờ", value: timeLeft.hours },
                                { label: "Phút", value: timeLeft.minutes },
                                { label: "Giây", value: timeLeft.seconds },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white text-black rounded px-1.5 sm:px-2 py-1 text-center min-w-[38px] sm:min-w-[42px]"
                                >
                                    <div>{String(item.value).padStart(2, "0")}</div>
                                    <div className="font-normal">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex gap-2 self-end sm:self-auto">
                    <button
                        className="sale-products-prev w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        className="sale-products-next w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ===== Product List ===== */}

            <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                navigation={{
                    nextEl: ".sale-products-next",
                    prevEl: ".sale-products-prev",
                }}
                spaceBetween={50}
                breakpoints={{
                    320: { slidesPerView: 2, slidesPerGroup: 2 },
                    640: { slidesPerView: 3, slidesPerGroup: 3 },
                    768: { slidesPerView: 4, slidesPerGroup: 4 },
                    1024: { slidesPerView: 5, slidesPerGroup: 5 },
                }}
                className="sale-products-slider"
            >
                {products.map((item) => (
                    <SwiperSlide key={item.productId}>
                        <ProductCard
                            id={item.productId}
                            name={item.name}
                            slug={item.slug}
                            mainImage={item.mainImage}
                            price={item.price}
                            discountPercent={item.salePercent}

                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ===== Footer ===== */}
            <div className="flex justify-center mt-4 sm:mt-5">
                <a
                    href={`/sales/${sale.slug}`}
                    className="bg-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                    Xem thêm
                </a>
            </div>
        </div>
    );
};

export default SaleOccasionProductFrame;
