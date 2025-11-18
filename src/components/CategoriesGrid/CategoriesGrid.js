import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import Link from "next/link";

const CategoriesGrid = ({ categories }) => {
  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md mb-1">
      <div className="grid grid-cols-5 gap-2 lg:grid-cols-6 xl:grid-cols-8">
        {categories?.map((category) => (
          <Link
            key={category._id}
            href={`/${category.slug}`}
            title={category.name}
            className="flex flex-col items-center p-1 sm:p-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={new URL(category.imageUrl, API_BASE_URL).href}
              alt={category.name}
              width={70}
              height={70}
              className="object-contain max-w-full max-h-full"
            />
            <p className="mt-2 sm:mt-4 text-center text-xs">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
