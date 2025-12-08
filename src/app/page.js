export const dynamic = "force-dynamic";

import { getBanners } from "@/apiServices/banner";
import { getAllCategories } from "@/apiServices/categories";
import { API_BASE_URL } from "@/apiServices/constants";
import { getPostCategories } from "@/apiServices/postCategory";
import { getAllPosts } from "@/apiServices/posts";
import { getAllProducts, getTopSellingProducts } from "@/apiServices/products";
import BannerSlider from "@/components/BannerSlider/BannerSlider";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import CategoryProducts from "@/components/CategoryProducts/CategoryProducts";
import GridBannerSlider from "@/components/GridBannerSlider/GridBannerSlider";
import VerticalBanners from "@/components/VerticalBanners/VerticalBanners";
import HorizontalBanners from "@/components/HorizontalBanners/HorizontalBanners";
import News from "@/components/News/News";
import ProductViewHistory from "@/components/ProductViewHistory/ProductViewHistory";
import SpecialProductsFrame from "@/components/SpecialProductsFrame/SpecialProductsFrame";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const categories = await getAllCategories();
  const categoriesHightLight = Array.isArray(categories)
    ? categories.slice(0, 8)
    : [];

  const currentPage = 1;
  const limit = 20;
  const limitTopSelling = 5;

  const categoriesWithProducts = await Promise.all(
    (categories || []).map(async (category) => {
      const response = await getAllProducts(currentPage, limit, category._id);
      const products = response.data;
      return { category, products };
    })
  );

  const categoriesWithTopSellingProduct = await Promise.all(
    categoriesHightLight.map(async (category) => {
      const response = await getTopSellingProducts(
        currentPage,
        limitTopSelling,
        category._id
      );
      const products = response?.data || [];
      return { category, products };
    })
  );

  const specialProducts = await getAllProducts(
    currentPage,
    limit,
    null,
    null,
    null,
    null,
    true
  );

  const isShow = true;
  const banners = await getBanners(currentPage, limit, isShow);
  const sliderFullBanners = [];
  const sliderPartCenterBanners = [];
  const sliderPartRightBanners = [];
  const sliderPartHorizontalBanners = [];

  if (banners) {
    banners.data.forEach((banner) => {
      if (banner.type === "slider-full") {
        sliderFullBanners.push(banner);
      } else if (banner.type === "slider-part-center") {
        sliderPartCenterBanners.push(banner);
      } else if (banner.type === "slider-part-right") {
        sliderPartRightBanners.push(banner);
      }
      else if (banner.type === "slider-part") {
        sliderPartHorizontalBanners.push(banner);
      }
    });
  }


  const isPostCategoriesRoot = "true";
  const postCategoryResponse = await getPostCategories(
    currentPage,
    limit,
    isPostCategoriesRoot
  );

  const postStatus = "published";
  const categoriesWithPosts = await Promise.all(
    (postCategoryResponse ? postCategoryResponse.data : []).map(
      async (category) => {
        const postsResponse = await getAllPosts(
          currentPage,
          limit,
          postStatus,
          category._id
        );
        return {
          ...category,
          posts: postsResponse ? postsResponse.data : [],
        };
      }
    )
  );
  return (
    <main className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-0">
      {/* Banner Section - Hiển thị ngang */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        {/* Banner Center - Chiếm 2/3 chiều rộng */}
        <div className="w-full md:w-2/3 mx-auto">
          {sliderPartCenterBanners && <BannerSlider banners={sliderPartCenterBanners} />}
        </div>

        {/* Banner Right - Chiếm 1/3 chiều rộng */}
        <div className="w-full md:w-1/3">
          {sliderPartRightBanners && <VerticalBanners banners={sliderPartRightBanners} />}
        </div>
      </div>


      {/* HorizontalBanners */}
      {sliderPartHorizontalBanners && <HorizontalBanners banners={sliderPartHorizontalBanners} />}

      {/* Category Grid */}
      <CategoriesGrid categories={categories} />

      {/* Special Products */}
      {specialProducts && specialProducts.data.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 px-4 py-2 inline-block">
            Sản phẩm đặc biệt
          </h2>
          <SpecialProductsFrame
            banner={sliderFullBanners[3]}
            products={specialProducts.data}
            isExtend={true}
          />
        </>
      )}

      {/* Best sell products */}
      <h2 className="text-xl font-bold text-gray-900 px-4 py-2 inline-block">
        Top sản phẩm bán chạy
      </h2>
      <CategoryProducts
        categories={categoriesHightLight}
        categoriesWithProducts={categoriesWithTopSellingProduct}
      />
      <ProductViewHistory />
      {/* CategoryProducts */}
      <h2 className="text-xl font-bold text-gray-900 px-4 py-2 inline-block">
        Mua Online Giá Siêu Rẻ
      </h2>

      <CategoryProducts
        banner={sliderFullBanners[1]}
        categories={categoriesHightLight}
        categoriesWithProducts={categoriesWithProducts}
        isExtend={true}
      />


      {/* Smart gadgets banner */}
      {sliderFullBanners && sliderFullBanners[2] && (
        <div className="my-6 relative w-full rounded-lg overflow-hidden shadow-md">
          <Link href={`/${sliderFullBanners[2].link}`}>
            <div className="relative w-full md:aspect-[15/4]">
              <Image
                src={new URL(sliderFullBanners[2].url, API_BASE_URL).href}
                alt="main-banner"
                fill
                priority
                quality={95}
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      )}

      {/* Post */}
      {categoriesWithPosts && categoriesWithPosts.length > 0 && (
        <News categoriesWithPosts={categoriesWithPosts} />
      )}
    </main>
  );
}
