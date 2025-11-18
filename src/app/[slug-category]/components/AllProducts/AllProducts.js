"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard/ProductCard";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";
import { ChevronDown, Filter as FilterIcon } from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";
import FilterPanel from "./components/FilterPanel";

export const AllProducts = ({
  categorySlug,
  initialProducts,
  brands,
  subCategories,
  totalPages,
  totalProducts,
  filterAttributesRaw,
  initialFiltersFromUrl,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(initialProducts);
  const [newTotalProducts, setNewTotalProducts] = useState(totalProducts);
  const [newTotalPages, setNewTotalPages] = useState(totalPages);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(
    initialFiltersFromUrl.page || 1
  );

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

  const [sortOption, setSortOption] = useState(() => {
    if (initialFiltersFromUrl.sort) return initialFiltersFromUrl.sort;
    if (initialFiltersFromUrl.sortPrice)
      return `price-${initialFiltersFromUrl.sortPrice}`;
    return null; // Default sort
  });

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const priceDropdownRef = useRef(null);
  const sortOptions = [
    { id: "newest", name: "Mới" },
    { id: "bestseller", name: "Bán chạy" },
    { id: "discount", name: "Giảm giá" },
    { id: "price", name: "Giá", hasDropdown: true },
  ];

  const [attributeFieldFilter, setAttributeFieldFilter] = useState({});

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
    setNewTotalPages(totalPages);
  }, [initialProducts, totalProducts, totalPages]);

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

      if (currentPage > 1) query.set("page", String(currentPage));

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
    currentPage,
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
    setCurrentPage(1);

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
    setCurrentPage(1);
    setFiltered(newFilters);
  };

  const handlePageChange = (page) => {
    if (page === currentPage || page < 1 || page > newTotalPages) return;
    setCurrentPage(page);
  };

  const handleSubCategoryClick = (subCatId) => {
    setCurrentPage(1);
    setFiltered((prev) => ({
      ...prev,
      subCategory: prev.subCategory === subCatId ? null : subCatId,
    }));
  };

  const handleBrandClick = (brandId) => {
    setCurrentPage(1);
    setFiltered((prev) => ({
      ...prev,
      brand: prev.brand === brandId ? null : brandId,
    }));
  };

  return (
    <div className="bg-white rounded-xl p-6 mt-6">
      {/* SubCategories */}
      {subCategories && subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto py-1">
          {subCategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() => handleSubCategoryClick(sub._id)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 whitespace-nowrap ${
                filtered.subCategory === sub._id
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="relative h-10 w-10">
                <Image
                  src={new URL(sub.imageUrl, API_BASE_URL).href}
                  alt={sub.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium">{sub.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* FILTER/BRANDS/SORT */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-800 font-medium hover:bg-gray-50"
          >
            <FilterIcon className="mr-2" /> Bộ Lọc
          </button>
          {/* Brands */}
          {brands && brands.length > 0 && (
            <>
              {brands.map((brandItem) => (
                <button
                  key={brandItem._id}
                  onClick={() => handleBrandClick(brandItem._id)}
                  className={`group relative rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-2 flex flex-col items-center ${
                    filtered.brand === brandItem._id
                      ? "bg-blue-100 ring-2 ring-blue-300"
                      : "bg-white"
                  }`}
                >
                  <Image
                    src={new URL(brandItem.imageUrl, API_BASE_URL).href}
                    alt={brandItem.name}
                    height={80}
                    width={80}
                    className="object-contain max-h-16 transition-all duration-300"
                  />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Sort options  */}
        <div className="flex border-b border-gray-200 mb-4">
          <div className="mr-4 text-gray-600 font-medium">Sắp xếp theo</div>
          {sortOptions.map((option) => (
            <div
              key={option.id}
              className="relative"
              ref={option.id === "price" ? priceDropdownRef : null}
            >
              <button
                onClick={() => handleSortChange(option.id)}
                className={`px-3 py-2 font-medium relative flex items-center ${
                  sortOption === option.id ||
                  (option.id === "price" &&
                    (sortOption === "price-asc" || sortOption === "price-desc"))
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {option.name}
                {option.hasDropdown && (
                  <ChevronDown size={16} className="ml-1" />
                )}
                {(sortOption === option.id ||
                  (option.id === "price" &&
                    (sortOption === "price-asc" ||
                      sortOption === "price-desc"))) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                )}
              </button>

              {option.id === "price" && isPriceDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md overflow-hidden z-10 w-40 border border-gray-200">
                  <button
                    onClick={() => handleSortChange("price", "asc")}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortOption === "price-asc"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    Giá thấp - cao
                  </button>
                  <button
                    onClick={() => handleSortChange("price", "desc")}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortOption === "price-desc"
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    Giá cao - thấp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Open Filter */}
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

      <div className="text-xl font-medium mb-4">
        {newTotalProducts} sản phẩm
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products && products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p._id} id={p._id} {...p} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Không tìm thấy sản phẩm nào.
            </p>
          )}
        </div>
      )}

      {newTotalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={newTotalPages}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};
