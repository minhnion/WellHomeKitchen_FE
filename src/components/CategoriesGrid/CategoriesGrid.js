import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import Link from "next/link";

const CategoriesGrid = ({ categories }) => {
  return (
    <div className="mb-6 mt-14">
      {/* Tiêu đề */}
      <Link href="/" className="block">
        <div className="bg-white text-xl font-bold text-blue-900 uppercase pb-2 px-4 py-3">
          DANH MỤC GIA DỤNG
        </div>
      </Link>

      {/* danh sách sản phẩm */}
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-0">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="
              bg-white shadow-sm hover:shadow-md 
              border border-gray-200 
              active:scale-105 active:shadow-lg active:z-10
              transition-transform duration-150 ease-out
              hover:scale-[1.02]
            "
          >
            <Link
              href={`/${category.slug}`}
              title={category.name}
              className="flex flex-col items-center p-2 sm:p-4"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3">
                <Image
                  src={new URL(category.imageUrl, API_BASE_URL).href}
                  alt={category.name}
                  width={64}
                  height={64}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <p className="text-center text-xs sm:text-sm font-medium ...">
                {category.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;