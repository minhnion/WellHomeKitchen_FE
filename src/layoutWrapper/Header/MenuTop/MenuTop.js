import Link from "next/link";

export const MenuTop = ({ categories }) => {
  return (
    <div className="w-full bg-gray-200">
      <div className="max-w-7xl mx-auto">
        <nav
          className="flex flex-wrap items-center justify-center md:space-x-6 py-2 
             max-h-[3.5rem] overflow-hidden md:max-h-none"
        >
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/${category.slug}`}
              className="text-blue-800 text-xs whitespace-nowrap transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
              title={`${category.name} - ${
                category.productCount || 0
              } sản phẩm`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
