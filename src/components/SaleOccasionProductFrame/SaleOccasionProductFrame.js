"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import { useRef, useEffect, useState } from "react";

const SaleOccasionProductFrame = ({ sale, products = [] }) => {
    const sliderRef = useRef(null);

    if (!sale || products.length === 0) return null;

    const scrollLeft = () => {
        sliderRef.current?.scrollBy({
            left: -320,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        sliderRef.current?.scrollBy({
            left: 320,
            behavior: "smooth",
        });
    };

    const [timeLeft, setTimeLeft] = useState(null);

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
                        onClick={scrollLeft}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* ===== Product List ===== */}
            <div
                ref={sliderRef}
                className="
        flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth
        [&::-webkit-scrollbar]:hidden
        [-ms-overflow-style:none]
        [scrollbar-width:none]"
            >

                {products.map((item) => (
                    <div
                        key={item.productId}
                        className="w-[180px] sm:w-[230px] flex-shrink-0"
                    >
                        <ProductCard
                            id={item.productId}
                            name={item.name}
                            slug={item.slug}
                            mainImage={item.mainImage}
                            price={item.price}
                            discountPercent={item.salePercent}
                            fluid
                        />
                    </div>
                ))}
            </div>

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
