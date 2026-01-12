"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import { ChevronDown, ChevronUp, Filter as FilterIcon } from "lucide-react";
import FilterPanel from "./components/FilterPanel";

export const AllProducts = ({
  category,
  categorySlug,
  initialProducts,
  brands,
  subCategories,
  totalProducts,
  filterAttributesRaw,
  initialFiltersFromUrl,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(initialProducts);
  const [newTotalProducts, setNewTotalProducts] = useState(totalProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);



  // State cho xem thêm sản phẩm - BAN ĐẦU CHỈ HIỆN 10 SẢN PHẨM
  const [showAllProducts, setShowAllProducts] = useState(false);
  const initialDisplayCount = 10; // Hiển thị 10 sản phẩm đầu tiên ban đầu

  // Hiển thị sản phẩm dựa trên trạng thái showAllProducts
  const displayedProducts = showAllProducts
    ? products // Nếu đã ấn xem thêm thì hiển thị tất cả
    : products.slice(0, initialDisplayCount); // Ban đầu chỉ hiện 10 sản phẩm đầu

  const priceFilterData = [
    { id: 1, label: "Dưới 10 Triệu", minPrice: 0, maxPrice: 10000000 },
    { id: 2, label: "10 - 15 Triệu", minPrice: 10000000, maxPrice: 15000000 },
    { id: 3, label: "15 - 20 Triệu", minPrice: 15000000, maxPrice: 20000000 },
    { id: 4, label: "Trên 20 Triệu", minPrice: 20000000, maxPrice: null },
  ];
  const [openSections, setOpenSections] = useState({
    category: true,
    subCategory: true,
    brand: true,
    price: true,
  });



  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [filtered, setFiltered] = useState(() => {
    const initial = {
      brand: initialFiltersFromUrl.brandId || null,
      subCategory: initialFiltersFromUrl.subCategoryId || null,
      minPrice: initialFiltersFromUrl.minPrice,
      maxPrice: initialFiltersFromUrl.maxPrice,
      newest: initialFiltersFromUrl.sort === "newest",
      bestseller: initialFiltersFromUrl.sort === "bestseller",
      discount: initialFiltersFromUrl.sort === "discount",
      sortPrice: initialFiltersFromUrl.sortPrice, // 'asc' or 'desc'
    };
    if (initialFiltersFromUrl.attributes) {
      for (const key in initialFiltersFromUrl.attributes) {
        initial[key] = initialFiltersFromUrl.attributes[key];
      }
    }
    return initial;
  });

  const pageTitle = (() => {
    // Ưu tiên subCategory
    if (filtered.subCategory) {
      const sub = subCategories.find(
        (s) => s._id === filtered.subCategory
      );
      if (sub?.name) return sub.name;
    }
    // Fallback category
    if (category?.name) {
      return category.name;
    }
    return "Sản phẩm";
  })();

  const [sortOption, setSortOption] = useState(() => {
    if (initialFiltersFromUrl.sort) return initialFiltersFromUrl.sort;
    if (initialFiltersFromUrl.sortPrice)
      return `price-${initialFiltersFromUrl.sortPrice}`;
    return null; // Default sort
  });

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const priceDropdownRef = useRef(null);
  const [attributeFieldFilter, setAttributeFieldFilter] = useState({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (filterAttributesRaw && Array.isArray(filterAttributesRaw)) {
      const filterObj = {};
      filterAttributesRaw.forEach((item) => {
        filterObj[item.key] = item.values.map((value) => ({
          value,
          label: value,
        }));
      });
      setAttributeFieldFilter(filterObj);
    }
  }, [filterAttributesRaw]);

  useEffect(() => {
    setProducts(initialProducts);
    setNewTotalProducts(totalProducts);
    // KHI CÓ SẢN PHẨM MỚI (FILTER THAY ĐỔI) THÌ RESET VỀ CHỈ HIỆN 10 SẢN PHẨM ĐẦU
    setShowAllProducts(false);
  }, [initialProducts, totalProducts]);

  useEffect(() => {
    const buildUrl = () => {
      let newPath = `/${categorySlug}`;
      const query = new URLSearchParams();

      // Brand slug
      if (filtered.brand) {
        const brandObj = brands.find((b) => b._id === filtered.brand);
        if (brandObj?.slug) {
          newPath += `/${brandObj.slug}`;
        }
      }

      // SubCategory slug
      if (filtered.subCategory) {
        const subCategoryObj = subCategories.find(
          (s) => s._id === filtered.subCategory
        );
        if (subCategoryObj?.slug) {
          newPath += `/${subCategoryObj.slug}`;
        }
      }

      // Other filters as query params
      if (filtered.minPrice !== undefined)
        query.set("minPrice", String(filtered.minPrice));
      if (filtered.maxPrice !== undefined)
        query.set("maxPrice", String(filtered.maxPrice));

      if (filtered.newest) query.set("sort", "newest");
      else if (filtered.bestseller) query.set("sort", "bestseller");
      else if (filtered.discount) query.set("sort", "discount");
      else if (filtered.sortPrice) {
        // 'asc' or 'desc'
        query.set("sortPrice", filtered.sortPrice);
      }

      // Dynamic attributes
      Object.keys(attributeFieldFilter).forEach((attrKey) => {
        if (filtered[attrKey]) {
          query.set(attrKey, String(filtered[attrKey]));
        }
      });

      const queryString = query.toString();
      return `${newPath}${queryString ? `?${queryString}` : ""}`;
    };

    const newUrl = buildUrl();
    const currentFullUrl =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    if (newUrl !== currentFullUrl) {
      router.push(newUrl, { scroll: false });
    }
  }, [
    filtered,
    categorySlug,
    brands,
    subCategories,
    router,
    pathname,
    searchParams,
    attributeFieldFilter,
  ]);

  const handleSortChange = (sortId, subOption = null) => {
    if (sortId === "price" && !subOption) {
      setIsPriceDropdownOpen((prev) => !prev);
      return;
    }
    setIsPriceDropdownOpen(false);

    let newFiltered = { ...filtered };

    if (sortId === "newest") {
      newFiltered.newest = true;
      newFiltered.bestseller = false;
      newFiltered.sortPrice = null;
      newFiltered.discount = false;
    } else if (sortId === "bestseller") {
      newFiltered.bestseller = true;
      newFiltered.newest = false;
      newFiltered.sortPrice = null;
      newFiltered.discount = false;
    } else if (sortId === "price") {
      newFiltered.sortPrice = subOption;
      newFiltered.bestseller = false;
      newFiltered.newest = false;
      newFiltered.discount = false;
    } else if (sortId === "discount") {
      newFiltered.discount = true;
      newFiltered.bestseller = false;
      newFiltered.sortPrice = null;
      newFiltered.newest = false;
    }
    setFiltered(newFiltered);
    setSortOption(subOption ? `${sortId}-${subOption}` : sortId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(e.target)
      ) {
        setIsPriceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const isFilterOpen = Boolean(anchorEl);

  const handleUpdateFiltered = (newFilters) => {
    setFiltered(newFilters);
  };

  const handleSubCategoryClick = (subCatId) => {
    setFiltered((prev) => ({
      ...prev,
      subCategory: prev.subCategory === subCatId ? null : subCatId,
    }));
  };

  const handleBrandClick = (brandId) => {
    setFiltered((prev) => ({
      ...prev,
      brand: prev.brand === brandId ? null : brandId,
    }));
  };

  // Xử lý xem thêm sản phẩm
  const handleLoadMore = () => {
    setShowAllProducts(true);
  };

  // Kiểm tra xem có cần hiển thị nút "Xem thêm" không

  const shouldShowLoadMore = products.length > initialDisplayCount && !showAllProducts;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">

      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden md:block">



        {/* Sub Categories */}
        {subCategories?.length > 0 && (
          <div className=" my-2 bg-white shadow-md">
            <div
              onClick={() => toggleSection("subCategory")}
              className="flex justify-between items-center p-4 cursor-pointer font-semibold border-b border-gray-200"
            >
              <span>Phân loại</span>
              {openSections.subCategory ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronUp size={18} />
              )}
            </div>

            {openSections.subCategory && (
              <div className="px-4 pb-4 space-y-2 ">
                {subCategories.map((sub) => {
                  const checked = filtered.subCategory === sub._id;
                  return (
                    <label
                      key={sub._id}
                      className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer ${checked
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleSubCategoryClick(sub._id)}
                        className="accent-blue-600"
                      />
                      <span>{sub.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* Brands */}
        {brands?.length > 0 && (
          <div className=" my-2 bg-white shadow-md">
            <div
              onClick={() => toggleSection("brand")}
              className="flex justify-between items-center p-4 cursor-pointer font-semibold border-b border-gray-200"
            >
              <span>Thương hiệu</span>
              {openSections.brand ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronUp size={18} />
              )}
            </div>

            {openSections.brand && (
              <div className="px-4 pb-4 space-y-2 ">
                {brands.map((b) => {
                  const checked = filtered.brand === b._id;
                  return (
                    <label
                      key={b._id}
                      className={`flex items-center gap-2 px-3 py-2 rounded  cursor-pointer ${checked
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleBrandClick(b._id)}
                        className="accent-blue-600"
                      />
                      <span>{b.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}


        {/* Price */}
        <div className=" my-2 bg-white shadow-md">
          <div
            onClick={() => toggleSection("price")}
            className="flex justify-between items-center p-4 cursor-pointer font-semibold border-b border-gray-200"
          >
            <span>Khoảng giá</span>
            {openSections.price ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>

          {openSections.price && (
            <div className="px-4 pb-4 space-y-2">
              {priceFilterData.map((p) => {
                const checked =
                  filtered.minPrice === p.minPrice &&
                  filtered.maxPrice === p.maxPrice;

                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer ${checked
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {

                          handleUpdateFiltered({
                            ...filtered,
                            minPrice: undefined,
                            maxPrice: undefined,
                          });
                        } else {

                          handleUpdateFiltered({
                            ...filtered,
                            minPrice: p.minPrice,
                            maxPrice: p.maxPrice,
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
          )}
        </div>


      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="w-full">
        {/* TOP BAR */}

        <div className="mb-4">
          {/* DESKTOP */}
          <div className="hidden md:flex items-center mb-4">
            {/* LEFT: TITLE + COUNT */}
            <div>
              <p className="text-sm">
                <span className="text-xl pr-4 font-semibold text-blue-900">
                  {pageTitle}
                </span>
                <span className="text-black font-medium ">{newTotalProducts}</span>
                <span className="text-gray-500"> sản phẩm</span>

              </p>
            </div>


            <div
              ref={sortDropdownRef}
              className="ml-auto relative w-48 shadow-md"
            >
              <div
                onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                className=" px-4 py-2 flex justify-between items-center cursor-pointer bg-white"
              >
                <span>Sắp xếp</span>
                <ChevronDown size={16} />
              </div>

              {isSortDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-full bg-white border shadow-lg z-20">
                  {[
                    { id: "newest", name: "Mới" },
                    { id: "bestseller", name: "Bán chạy" },
                    { id: "discount", name: "Giảm giá" },
                    { id: "price-asc", name: "Giá thấp - cao" },
                    { id: "price-desc", name: "Giá cao - thấp" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        const [sortId, sub] = option.id.split("-");
                        handleSortChange(sortId, sub || null);
                        setIsSortDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <div className="md:hidden flex items-center justify-between gap-3">
            {/* LEFT: TITLE + COUNT */}
            <div>
              <h1 className="text-lg font-semibold text-blue-900">
                {pageTitle}
              </h1>
              <p className="text-sm text-gray-500">
                {newTotalProducts} sản phẩm
              </p>
            </div>

            {/* RIGHT: FILTER BUTTON */}
            <button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="
    flex items-center gap-2
    px-4 py-2
    bg-white
    border border-gray-200
    rounded-full
    shadow-sm
    active:scale-95
    transition
  "
            >
              <FilterIcon size={18} className="mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>



        {/* PRODUCTS GRID - CHỈ SỬA PHẦN NÀY */}
        <div className="mt-4">
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-3">
              {displayedProducts.map((p) => (
                <ProductCard key={p._id} id={p._id} {...p} fluid />
              ))}
            </div>

          ) : (
            <p className="text-center text-gray-500 py-8">
              Không tìm thấy sản phẩm nào.
            </p>
          )}
        </div>

        {/* XEM THÊM BUTTON */}
        {shouldShowLoadMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="relative overflow-hidden px-6 py-3 border border-black-600 text-black bg-white rounded-lg font-medium transition-colors
                   before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-red-600 
                   before:z-0 before:transition-all before:duration-500 hover:before:left-0
                   hover:text-white"
            >
              <span className="relative z-10">Xem thêm sản phẩm</span>
            </button>
          </div>
        )}
      </main>

      {/* ================= MOBILE FILTER PANEL ================= */}
      <FilterPanel
        anchorEl={anchorEl}
        open={isFilterOpen}
        onClose={() => setAnchorEl(null)}
        filtered={filtered}
        changeFiltered={handleUpdateFiltered}
        brands={brands}
        subCategories={subCategories}
        attributeFieldFilter={attributeFieldFilter}
      />
    </div>
  );
};