export const dynamic = "force-dynamic";

import { getBanners } from "@/apiServices/banner";
import { getAllCategories } from "@/apiServices/categories";
import { getPostCategories } from "@/apiServices/postCategory";
import { getAllPosts } from "@/apiServices/posts";
import { getAllProducts, getTopSellingProducts } from "@/apiServices/products";
import BannerSlider from "@/components/BannerSlider/BannerSlider";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import CategoryProducts from "@/components/CategoryProducts/CategoryProducts";
import VerticalBanners from "@/components/VerticalBanners/VerticalBanners";
import HorizontalBanners from "@/components/HorizontalBanners/HorizontalBanners";
import News from "@/components/News/News";
import ProductViewHistory from "@/components/ProductViewHistory/ProductViewHistory";
import SpecialProductsFrame from "@/components/SpecialProductsFrame/SpecialProductsFrame";
import ProductCard from "@/components/ProductCard/ProductCard";
import ProductRowCard from "@/components/ProductRowCard/ProductRowCard";
import PartnerBanners from "@/components/PartnerBanners/PartnerBanners";

export default async function Home() {
  const topSellingResponse = await getTopSellingProducts(1, 5, null);
  const top5Products = topSellingResponse?.data || [];

  const categories = await getAllCategories();
  const fridgeCategory = categories.find(
    (cat) => cat.name.toLowerCase() === "tủ lạnh"
  );
  const cookwareCategories = categories.filter((cat) => {
    const name = cat.name?.toLowerCase();
    return name?.startsWith("nồi") || name === "bếp từ" || name === "gia dụng";
  });

  const categoriesHightLight = Array.isArray(categories)
    ? categories.slice(0, 8)
    : [];

  const currentPage = 1;
  const limit = 10;
  const limitTopSelling = 5;

  const fridgeProducts = fridgeCategory?._id
    ? (await getTopSellingProducts(1, 9, fridgeCategory._id))?.data || []
    : [];

  const cookwareProducts = await Promise.all(
    cookwareCategories.map(async (category) => {
      const res = await getTopSellingProducts(1, 5, category._id);
      const products = res?.data || [];

      return products.filter((product) => {
        const name = product.name;
        if (!name) return false;
        const lower = name.toLowerCase();
        return lower.startsWith("nồi") || lower.startsWith("chảo");
      });
    })
  );

  const finalCookwareProducts = cookwareProducts.flat().slice(0, 5);

  const categoriesWithProducts = await Promise.all(
    (categories || []).map(async (category) => {
      const response = await getAllProducts(currentPage, limit, category._id);
      const products = response.data;
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
  const banners = await getBanners(currentPage, 30, isShow);
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
      } else if (banner.type === "slider-part") {
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
      {/* Banner Section - Đã sửa Layout */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* 1. CỘT RỖNG GIỮ CHỖ CHO MENU (Desktop) */}
        {/* Width 250px khớp với width của Menu trong Header */}
        <div className="hidden md:block w-[130px] flex-shrink-0"></div>

        {/* 2. KHỐI BANNER CHÍNH (Tự động chiếm phần còn lại) */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            {/* Banner Slider (Giữa) */}
            <div className="w-full lg:w-3/4 h-full">
              {sliderPartCenterBanners && (
                <BannerSlider banners={sliderPartCenterBanners} />
              )}
            </div>

            {/* Banner Dọc (Phải) */}
            <div className="w-full lg:w-1/4 h-full">
              {sliderPartRightBanners && (
                <VerticalBanners banners={sliderPartRightBanners} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HorizontalBanners */}
      {sliderPartHorizontalBanners && (
        <HorizontalBanners banners={sliderPartHorizontalBanners.slice(0, 4)} />
      )}

      {/* Best sell products */}
      {top5Products.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-blue-900 mb-4 mt-14">
            SẢN PHẨM BÁN CHẠY
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {top5Products.map((product) => (
              <ProductCard key={product._id} id={product._id} {...product} />
            ))}
          </div>
        </>
      )}

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

      <ProductViewHistory />

      {/* CategoryProducts */}
      <h2 className="text-xl font-bold text-blue-900 py-2 inline-block">
        ƯU ĐÃI DANH MỤC
      </h2>

      <CategoryProducts
        banner={sliderFullBanners[1]}
        categories={categoriesHightLight}
        categoriesWithProducts={categoriesWithProducts}
        isExtend={true}
      />

      {/* CookwareProducts */}
      {finalCookwareProducts.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-blue-900 mb-4 mt-14">
            NỒI CHẢO CHUẨN CHÂU ÂU
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {finalCookwareProducts.map((product) => (
              <ProductCard key={product._id} id={product._id} {...product} />
            ))}
          </div>
        </>
      )}

      {/* fridgeProducts */}
      {fridgeProducts.length > 0 && (
        <div className="bg-white my-10">
          <h2 className="text-xl font-bold text-blue-900 px-4 py-4">TỦ LẠNH</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 max-w-[1000px] ">
            {fridgeProducts.map((product, index) => (
              <div
                key={product._id}
                className="border-b border-gray-200 md:[&:nth-last-child(-n+3)]:border-b-0"
              >
                <ProductRowCard {...product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {sliderPartHorizontalBanners && (
        <PartnerBanners banners={sliderPartHorizontalBanners} />
      )}

      {/* Post */}
      {categoriesWithPosts && categoriesWithPosts.length > 0 && (
        <News categoriesWithPosts={categoriesWithPosts} />
      )}
    </main>
  );
}
