import { getCategoryBySlug } from "@/apiServices/categories";
import { notFound } from "next/navigation";
import {
  getProductWithFilter,
  getTopSellingProducts,
} from "@/apiServices/products";
import { getAllBrands } from "@/apiServices/brand";
import Link from "next/link";
import { getSubCategories } from "@/apiServices/subCategory";
import { getFilterAttriButes } from "@/apiServices/filterAttribute";
import { AllProducts } from "../components/AllProducts/AllProducts";

/* ================= PARSE FILTERS ================= */
const parseFiltersFromParams = (
  params,
  searchParams,
  brandsData,
  subCategoriesData
) => {
  const { filter_slugs } = params;

  let brandId = null;
  let subCategoryId = null;
  let brandSlug = null;
  let subCategorySlug = null;

  if (filter_slugs?.length) {
    const first = filter_slugs[0];
    const brand = brandsData.find((b) => b.slug === first);

    if (brand) {
      brandId = brand._id;
      brandSlug = brand.slug;

      if (filter_slugs[1]) {
        const sub = subCategoriesData.find(
          (s) => s.slug === filter_slugs[1]
        );
        if (sub) {
          subCategoryId = sub._id;
          subCategorySlug = sub.slug;
        }
      }
    } else {
      const sub = subCategoriesData.find((s) => s.slug === first);
      if (sub) {
        subCategoryId = sub._id;
        subCategorySlug = sub.slug;
      }
    }
  }

  const initialFilters = {
    brandId,
    subCategoryId,
    brandSlug,
    subCategorySlug,
    minPrice: searchParams.minPrice
      ? parseInt(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseInt(searchParams.maxPrice)
      : undefined,
    sort: searchParams.sort || null,
    sortPrice: searchParams.sortPrice || null,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    attributes: {},
  };

  Object.keys(searchParams).forEach((key) => {
    if (
      ![
        "minPrice",
        "maxPrice",
        "sort",
        "sortPrice",
        "page",
      ].includes(key)
    ) {
      initialFilters.attributes[key] = searchParams[key];
    }
  });

  return initialFilters;
};

/* ================= META ================= */
export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const category = await getCategoryBySlug(params.slugCategory);
  return {
    title: category ? `${category.name} - Bepanphu` : "Danh mục",
  };
}

/* ================= PAGE ================= */
export default async function CategoryProductsDetailPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const slugCategory = params.slugCategory;
  const category = await getCategoryBySlug(slugCategory);

  if (!category) notFound();

  const brands = await getAllBrands(category._id);
  const subCategories = await getSubCategories(category._id);

  const initialFilters = parseFiltersFromParams(
    params,
    searchParams,
    brands,
    subCategories
  );

  /* ================= BREADCRUMB ================= */
  const breadcrumbItems = [{ href: "/", label: "Trang chủ" }];


  if (
    initialFilters.subCategorySlug &&
    subCategories.some((s) => s.slug === initialFilters.subCategorySlug)
  ) {
    const sub = subCategories.find(
      (s) => s.slug === initialFilters.subCategorySlug
    );

    breadcrumbItems.push({
      href: `/${category.slug}/${initialFilters.subCategorySlug}`,
      label: sub.name,
    });
  }

  else {
    breadcrumbItems.push({
      href: `/${category.slug}`,
      label: category.name,
    });
  }

  /* ================= DATA ================= */
  const filterAttributeData = await getFilterAttriButes(category._id);
  const limit = 1000;

  const productsRes = await getProductWithFilter(
    initialFilters.page,
    limit,
    category._id,
    initialFilters.subCategoryId,
    initialFilters.brandId,
    initialFilters.sort === "newest",
    initialFilters.sort === "bestseller",
    initialFilters.sort === "discount",
    initialFilters.sortPrice,
    initialFilters.minPrice,
    initialFilters.maxPrice,
    initialFilters.attributes
  );

  return (
    <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-6">
      {/* ================= BREADCRUMB UI ================= */}
      <nav className="flex flex-wrap items-center mb-6 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <div key={item.href} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-gray-800">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* ================= PRODUCTS ================= */}
      <AllProducts
        category={category}
        categorySlug={category.slug}
        brands={brands}
        subCategories={subCategories}
        initialProducts={productsRes?.data || []}
        totalPages={productsRes?.pagination?.totalPages || 0}
        totalProducts={productsRes?.pagination?.totalProducts || 0}
        filterAttributesRaw={filterAttributeData?.attributes || []}
        initialFiltersFromUrl={initialFilters}
      />
    </div>
  );
}
