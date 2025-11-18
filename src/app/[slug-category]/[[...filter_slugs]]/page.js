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
import { HighlightProducts } from "../components/HighlightProducts/HighlightProducts";
import FamousBrands from "../components/FamousBrands/FamousBrands";
import ProductViewHistory from "@/components/ProductViewHistory/ProductViewHistory";

const parseFiltersFromParams = (
  params,
  searchParams,
  brandsData,
  subCategoriesData
) => {
  const { "slug-category": categorySlugParam, filter_slugs } = params;
  let brandId = null;
  let subCategoryId = null;
  let brandSlugFromUrl = null;
  let subCategorySlugFromUrl = null;

  if (filter_slugs && filter_slugs.length > 0) {
    const potentialBrandSlug = filter_slugs[0];
    const foundBrand = brandsData.find((b) => b.slug === potentialBrandSlug);
    if (foundBrand) {
      brandSlugFromUrl = potentialBrandSlug;
      brandId = foundBrand._id;
      if (filter_slugs.length > 1) {
        const potentialSubCategorySlug = filter_slugs[1];
        const foundSub = subCategoriesData.find(
          (s) => s.slug === potentialSubCategorySlug
        );
        if (foundSub) {
          subCategorySlugFromUrl = potentialSubCategorySlug;
          subCategoryId = foundSub._id;
        }
      }
    } else {
      const potentialSubCategorySlug = filter_slugs[0];
      const foundSub = subCategoriesData.find(
        (s) => s.slug === potentialSubCategorySlug
      );
      if (foundSub) {
        subCategorySlugFromUrl = potentialSubCategorySlug;
        subCategoryId = foundSub._id;
      }
    }
  }

  const initialFilters = {
    brandId,
    subCategoryId,
    brandSlug: brandSlugFromUrl,
    subCategorySlug: subCategorySlugFromUrl,
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
        "brandId",
        "subCategoryId",
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

export async function generateMetadata({ params, searchParams }) {
  const { "slug-category": slugCategory } = params;
  const category = await getCategoryBySlug(slugCategory);
  if (!category) {
    return { title: "Danh mục không tồn tại" };
  }

  let title = `${category.name} - Kitchencare`;
  return {
    title: title,
    openGraph: { title: title },
    twitter: { title: title },
  };
}

export default async function CategoryProductsDetailPage({
  params,
  searchParams,
}) {
  const { "slug-category": slugCategoryFromParams } = params;

  const category = await getCategoryBySlug(slugCategoryFromParams);
  if (!category) {
    notFound();
  }

  const brandsWithCategory = await getAllBrands(category._id);
  const subCategories = await getSubCategories(category._id);

  const initialFilters = parseFiltersFromParams(
    params,
    searchParams,
    brandsWithCategory,
    subCategories
  );

  const breadcrumbItems = [];

  breadcrumbItems.push({ href: "/", label: "Trang chủ" });

  breadcrumbItems.push({
    href: `/${category.slug || slugCategoryFromParams}`,
    label: category?.name || "Danh mục",
  });

  if (
    initialFilters.brandSlug &&
    brandsWithCategory.find((b) => b.slug === initialFilters.brandSlug)
  ) {
    const brand = brandsWithCategory.find(
      (b) => b.slug === initialFilters.brandSlug
    );
    breadcrumbItems.push({
      href: `/${category.slug || slugCategoryFromParams}/${
        initialFilters.brandSlug
      }`,
      label: brand.name,
    });
  }

  if (
    initialFilters.subCategorySlug &&
    subCategories.find((s) => s.slug === initialFilters.subCategorySlug)
  ) {
    const subCategory = subCategories.find(
      (s) => s.slug === initialFilters.subCategorySlug
    );
    const brandPath = initialFilters.brandSlug
      ? `${initialFilters.brandSlug}/`
      : "";
    breadcrumbItems.push({
      href: `/${category.slug || slugCategoryFromParams}/${brandPath}${
        initialFilters.subCategorySlug
      }`,
      label: subCategory.name,
    });
  }

  const bannerUrl = category.bannerUrl;
  const highlightResponse = await getTopSellingProducts(
    1,
    10,
    category._id,
    initialFilters.subCategoryId,
    initialFilters.brandId
  );
  const highlightProducts = highlightResponse?.data || [];

  const filterAttributeData = await getFilterAttriButes(category._id);
  const limit = 20;

  const allProductsResponse = await getProductWithFilter(
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

  const products = allProductsResponse?.data || [];
  const totalPages = allProductsResponse?.pagination?.totalPages || 0;
  const totalProducts = allProductsResponse?.pagination?.totalProducts || 0;

  return (
    <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
      <nav className="flex items-center flex-wrap mb-6 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <div key={item.href} className="flex items-center">
              {isLast ? (
                <span className="text-gray-800 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-primary"
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <span className="mx-2 text-gray-500" aria-hidden="true">
                  /
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <HighlightProducts products={highlightProducts} banner={bannerUrl} />
      <ProductViewHistory />
      <AllProducts
        categorySlug={category.slug || slugCategoryFromParams}
        brands={brandsWithCategory}
        subCategories={subCategories}
        initialProducts={products}
        totalPages={totalPages}
        totalProducts={totalProducts}
        categoryId={category._id}
        limit={limit}
        filterAttributesRaw={filterAttributeData?.attributes || []}
        initialFiltersFromUrl={initialFilters}
      />
    </div>
  );
}
