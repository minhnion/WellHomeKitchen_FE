
import { getProductsBySlug, getAllProducts } from "@/apiServices/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import SellingPoints from "./components/SellingPoint";
import DetailsSection from "./components/DeatilsSection";
import RelatedProducts from "./components/RelatedProducts";
import { API_BASE_URL } from "@/apiServices/constants";
import { getAllPosts } from "@/apiServices/posts";
import { getReviewsByProduct } from "@/apiServices/review";

export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { slug } = params;
  const product = await getProductsBySlug(slug);
  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
      description: "Sản phẩm không tồn tại",
    };
  }
  const { name, description } = product;
  return {
    title: name,
    description: description || "Mô tả sản phẩm không có sẵn",
    openGraph: {
      title: name,
      description: description || "Mô tả sản phẩm không có sẵn",
      images: [
        {
          url: `${API_BASE_URL}${product.mainImage}`,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      title: name,
      description: description || "Mô tả sản phẩm không có sẵn",
      images: [
        {
          url: `${API_BASE_URL}${product.mainImage}`,
          width: 800,
          height: 600,
        },
      ],
    },
  };
}

export default async function ProductDetailPage(props) {
  const params = await props.params;
  const { slug } = params;

  const product = await getProductsBySlug(slug);

  if (!product) {
    notFound();
  }

  const {
    _id,
    name,
    price,
    discountPercent,
    mainImage,
    galleryImages,
    description,
    sku,
    specifications,
    introductionContent,
    category,
    brand,
    subCategory,
    starAverage,
    numberOfReviews,
  } = product;

  const posts = await getAllPosts(1, 6, null, null, category.slug);
  const reviews = await getReviewsByProduct(_id, 1, 5);

  return (
    <main className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
      <div className="container">
        {/* Breadcrumb navigation */}
        <nav className="flex flex-wrap items-center mb-6 text-sm text-gray-500 overflow-hidden">
          <Link href="/" className="hover:text-primary whitespace-nowrap">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>

          {category && (
            <>
              <Link
                href={`/${category?.slug}`}
                className="hover:text-primary max-sm:truncate max-sm:max-w-[80px] sm:max-w-[200px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap"
                title={category?.name || "Danh mục"}
              >
                {category?.name || "Danh mục"}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}

          {brand?.name && (
            <>
              <Link
                href={`/${category?.slug}/${brand?.slug}`}
                className="hover:text-primary max-sm:truncate max-sm:max-w-[80px] sm:max-w-[150px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap"
                title={brand.name}
              >
                {brand.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}

          {subCategory?.name && (
            <>
              <Link
                href={`/${category?.slug}/${brand?.slug}/$${subCategory?.slug}`}
                className="hover:text-primary max-sm:truncate max-sm:max-w-[80px] sm:max-w-[150px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap"
                title={subCategory.name}
              >
                {subCategory.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}

          <span
            className="text-gray-800 truncate max-sm:max-w-[120px] sm:max-w-[200px] md:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
            title={name}
          >
            {name}
          </span>
        </nav>

        {/* Product container */}
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5">
              <ProductImages
                mainImage={mainImage}
                galleryImages={galleryImages}
              />
              <SellingPoints />
            </div>
            <div className="md:w-3/5 p-6 border-t md:border-t-0 md:border-l border-gray-200">
              <h1 className="text-3xl font-semibold text-blue-800 mb-1 max-sm:text-xl">
                {name}
              </h1>
              <ProductInfo
                product={{
                  id: _id,
                  name,
                  price,
                  mainImage,
                  discountPercent,
                  description,
                  sku,
                  brand,
                  category,
                  specifications,
                  starAverage,
                  numberOfReviews,
                }}
              />
            </div>
          </div>
        </div>

        {/* Product details section */}
        <DetailsSection
          productId={_id}
          specifications={specifications}
          introductionContent={introductionContent}
          posts={posts?.data}
          reviews={reviews?.data}

        />

        {/* Product relations */}
        <RelatedProducts
          currentProductId={_id}
          categoryId={category._id}
          brand={brand}
        />
      </div>
    </main>
  );
}