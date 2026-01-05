import { getConfigByKey } from "@/apiServices/config";
import { API_BASE_URL } from "@/apiServices/constants";
import { getAllProducts } from "@/apiServices/products";
import Image from "next/image";
import Link from "next/link";
import SpecialProductsClient from "./SpecialProductsClient/SpecialProductsClient";

export async function generateMetadata({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const currentPage = parseInt(searchParams?.page) || 1;
  const limit = 10;

  try {
    const productsResponse = await getAllProducts(
      currentPage,
      limit,
      null,
      null,
      null,
      null,
      true
    );
    const { pagination } = productsResponse;

    const title =
      currentPage > 1
        ? `Sản phẩm đặc biệt - Trang ${currentPage} | Bepanphu`
        : `Sản phẩm đặc biệt | Bepanphu`;

    const description = `Khám phá ${pagination.totalProducts} sản phẩm đặc biệt với giá ưu đãi. Trang ${currentPage}/${pagination.totalPages}. Mua ngay với chất lượng tốt nhất.`;

    return {
      title,
      description,
      keywords: "sản phẩm đặc biệt, ưu đãi, khuyến mãi, mua sắm online",
      openGraph: {
        title,
        description,
      },
      twitter: {
        title,
        description,
      },
    };
  } catch (error) {
    return {
      title: "Sản phẩm đặc biệt | Bepanphu",
      description:
        "Khám phá các sản phẩm đặc biệt với giá ưu đãi tại website của chúng tôi.",
    };
  }
}

export default async function SpecialProductPage({ searchParams: searchParamsPromise }) {
  const searchParams = await searchParamsPromise;
  const limit = 10;
  const currentPage = parseInt(searchParams?.page) || 1;

  try {
    const [productsResponse, specialProductsBanner] = await Promise.all([
      getAllProducts(currentPage, limit, null, null, null, null, true),
      getConfigByKey("special-banner").catch(() => null),
    ]);

    const { data: specialProducts, pagination } = productsResponse;
    const { totalPages, totalProducts } = pagination;

    return (
      <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center mb-6 text-sm text-gray-500 overflow-hidden">
          <Link href="/" className="hover:text-primary whitespace-nowrap">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span
            className="text-gray-800 truncate max-sm:max-w-[120px] sm:max-w-[200px] md:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
            title="Sản phẩm đặc biệt"
          >
            Sản phẩm đặc biệt
          </span>
        </nav>

        {/* Special Banner */}
        {specialProductsBanner && (
          <div className="w-full mb-6">
            <Image
              src={`${API_BASE_URL}${specialProductsBanner}`}
              alt="Special Product Banner"
              width={1200}
              height={300}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        )}

        {/* Client Component để handle pagination */}
        <SpecialProductsClient
          initialProducts={specialProducts}
          initialCurrentPage={currentPage}
          initialTotalPages={totalPages}
          initialTotalProducts={totalProducts}
          limit={limit}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching special products:", error);
    return (
      <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
        <nav className="flex flex-wrap items-center mb-6 text-sm text-gray-500 overflow-hidden">
          <Link href="/" className="hover:text-primary whitespace-nowrap">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Sản phẩm đặc biệt</span>
        </nav>
        <div className="text-center text-red-500">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }
}
