"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { ChevronDown, ChevronUp, Filter as FilterIcon } from "lucide-react";
import FilterPanelNew from "./components/FilterPanelNew";
import { useRouter, useSearchParams } from "next/navigation";

export default function SaleProductsClient({
    sale,
    initialProducts,
    totalProducts,
    categories = [],
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    /* ================= DATA ================= */
    const products = initialProducts || [];

    const priceRanges = [
        { label: "Dưới 10 triệu", min: 0, max: 10000000 },
        { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
        { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
        { label: "Trên 20 triệu", min: 20000000, max: null },
    ];

    /* ================= STATE ================= */
    const [priceFilter, setPriceFilter] = useState(null);
    const [sortOption, setSortOption] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(true);
    const [categoryOpen, setCategoryOpen] = useState(true);

    /* ================= MOBILE FILTER ================= */
    const [filterOpen, setFilterOpen] = useState(false);

    /* ================= CONSTANT ================= */
    const DISPLAY_LIMIT = 10;

    /* ================= FILTER + SORT ================= */
    const filteredProducts = useMemo(() => {
        let result = [...products];

        /* ===== FILTER PRICE ===== */
        if (priceFilter) {
            result = result.filter((p) => {
                if (priceFilter.max === null)
                    return p.price >= priceFilter.min;
                return (
                    p.price >= priceFilter.min &&
                    p.price <= priceFilter.max
                );
            });
        }

        /* ===== SORT (FULL LIKE ALLPRODUCT) ===== */
        if (sortOption === "newest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        if (sortOption === "bestseller") {
            result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        }

        if (sortOption === "discount") {
            result.sort(
                (a, b) =>
                    (b.salePercent || 0) - (a.salePercent || 0)
            );
        }

        if (sortOption === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        }

        if (sortOption === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        }

        /* ===== LOAD MORE ===== */
        if (!showAll) {
            result = result.slice(0, DISPLAY_LIMIT);
        }

        return result;
    }, [products, priceFilter, sortOption, showAll]);

    const showLoadMore =
        products.length > DISPLAY_LIMIT && !showAll;

    const updateQuery = (newParams) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        router.push(`?${params.toString()}`, { scroll: false });
    };


    /* ================= RENDER ================= */
    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">

            {/* ================= SIDEBAR (DESKTOP) ================= */}
            <aside className="hidden md:block">

                <div className="bg-white shadow-md mb-5">
                    <div
                        className="p-4 font-semibold border-b border-gray-200 flex justify-between items-center cursor-pointer select-none"
                        onClick={() => setCategoryOpen((p) => !p)}
                    >
                        <span>Danh mục sản phẩm ưu đãi</span>
                        <ChevronUp
                            size={18}
                            className={`transition-transform duration-300 ${categoryOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>


                    <div
                        className={`overflow-hidden transition-all duration-300 ${categoryOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="p-4 space-y-2">
                            {/* TẤT CẢ trong đợt sale */}
                            <Link
                                href={`/sales/${sale.slug}`}
                                className="block px-3 py-2 font-medium hover:bg-gray-100 rounded"
                            >
                                Tất cả
                            </Link>

                            {/* CATEGORY trong đợt sale */}
                            {categories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/sales/${sale.slug}?category=${cat.slug}`}
                                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>

                    </div>

                </div>

                <div className="bg-white shadow-md ">

                    <div
                        className="p-4 font-semibold border-b border-gray-200 flex justify-between items-center cursor-pointer select-none"
                        onClick={() => setPriceOpen((p) => !p)}
                    >
                        <span>Khoảng giá</span>
                        <ChevronUp
                            size={18}
                            className={`transition-transform duration-300 ${priceOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${priceOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="p-4 space-y-2">
                            {priceRanges.map((p) => {
                                const checked =
                                    priceFilter?.min === p.min &&
                                    priceFilter?.max === p.max;

                                return (
                                    <label
                                        key={p.label}
                                        className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer
                                        ${checked
                                                ? "bg-blue-100 text-blue-600"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => {
                                                if (checked) {
                                                    setPriceFilter(null);
                                                    updateQuery({ minPrice: null, maxPrice: null });
                                                } else {
                                                    setPriceFilter({ min: p.min, max: p.max });
                                                    updateQuery({
                                                        minPrice: p.min,
                                                        maxPrice: p.max,
                                                    });
                                                }
                                            }}

                                            className="accent-blue-600"
                                        />
                                        <span>{p.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>


            </aside>

            {/* ================= MAIN ================= */}
            <main className="w-full">

                {/* ===== TOP BAR ===== */}
                <div className="mb-4">

                    {/* DESKTOP */}
                    <div className="hidden md:flex items-center mb-4">
                        <div>
                            <span className="text-xl font-semibold text-blue-900">
                                {sale.name}
                            </span>
                            <span className="ml-2 text-gray-600">
                                ({totalProducts} sản phẩm)
                            </span>
                        </div>

                        {/* SORT */}
                        <div className="ml-auto relative w-56">
                            <div
                                onClick={() => setSortOpen((p) => !p)}
                                className="px-4 py-2 bg-white rounded flex justify-between items-center cursor-pointer"
                            >
                                <span>Sắp xếp</span>
                                <ChevronDown size={16} />
                            </div>

                            {sortOpen && (
                                <div className="absolute top-full right-0 w-full bg-white shadow z-20">
                                    {[
                                        { id: "newest", label: "Mới nhất" },
                                        { id: "bestseller", label: "Bán chạy" },
                                        { id: "price-asc", label: "Giá thấp - cao" },
                                        { id: "price-desc", label: "Giá cao - thấp" },
                                    ].map((o) => (
                                        <button
                                            key={o.id}
                                            onClick={() => {
                                                setSortOption(o.id);
                                                setSortOpen(false);

                                                updateQuery({
                                                    sort: o.id,
                                                    sortPrice:
                                                        o.id === "price-asc"
                                                            ? "asc"
                                                            : o.id === "price-desc"
                                                                ? "desc"
                                                                : null,
                                                });
                                            }}


                                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE */}
                    <div className="md:hidden flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-semibold text-blue-900">
                                {sale.name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {totalProducts} sản phẩm
                            </p>
                        </div>

                        <button
                            onClick={() => setFilterOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow"
                        >
                            <FilterIcon size={18} />
                            Bộ lọc
                        </button>
                    </div>
                </div>

                {/* ===== PRODUCTS ===== */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredProducts.map((p) => (
                            <ProductCard
                                key={p.productId}
                                id={p.productId}
                                name={p.name}
                                slug={p.slug}
                                price={p.price}
                                mainImage={p.mainImage}
                                discountPercent={p.salePercent}
                                fluid
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">
                        Không có sản phẩm phù hợp.
                    </p>
                )}

                {/* ===== LOAD MORE ===== */}
                {showLoadMore && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-6 py-3 border rounded-lg bg-white hover:bg-red-600 hover:text-white transition"
                        >
                            Xem thêm sản phẩm
                        </button>
                    </div>
                )}
            </main>

            {/* ================= MOBILE FILTER PANEL ================= */}
            <FilterPanelNew
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                filtered={{
                    minPrice: priceFilter?.min,
                    maxPrice: priceFilter?.max,
                    sortPrice:
                        sortOption === "price-asc"
                            ? "asc"
                            : sortOption === "price-desc"
                                ? "desc"
                                : null,
                    discount: sortOption === "discount",
                }}
                changeFiltered={(f) => {
                    setPriceFilter(
                        f.minPrice !== undefined
                            ? { min: f.minPrice, max: f.maxPrice }
                            : null
                    );
                    if (f.discount) setSortOption("discount");
                    if (f.sortPrice === "asc") setSortOption("price-asc");
                    if (f.sortPrice === "desc") setSortOption("price-desc");
                }}
            />
        </div>
    );
}
