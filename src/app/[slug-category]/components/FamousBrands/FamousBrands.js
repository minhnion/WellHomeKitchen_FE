"use client";
import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import { useState } from "react";

// const fakeBrands = [
//   { id: 1, name: "Bosch", logo: "/api/placeholder/200/100" },
//   { id: 2, name: "Siemens", logo: "/api/placeholder/200/100" },
//   { id: 3, name: "Electrolux", logo: "/api/placeholder/200/100" },
//   { id: 4, name: "LG", logo: "/api/placeholder/200/100" },
//   { id: 5, name: "Samsung", logo: "/api/placeholder/200/100" },
//   { id: 7, name: "LG", logo: "/api/placeholder/200/100" },
// ];

export default function FamousBrands({ brands }) {
  const [isHovered, setIsHovered] = useState(null);

  return (
    <>
      {brands && (
        <section className="bg-gray-100  py-8 rounded-xl shadow-lg">
          <div className="container mx-4">
            <div className="text-center mb-8">
              <h2 className="text-base md:text-xl font-bold text-gray-800 mb-2">
                CÁC THƯƠNG HIỆU NỔI TIẾNG
              </h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto px-4">
                Chúng tôi hợp tác với các thương hiệu hàng đầu để mang đến cho
                bạn sản phẩm chất lượng cao
              </p>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 p-2 flex flex-col items-center"
                  onMouseEnter={() => setIsHovered(brand._id)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <Image
                    src={new URL(brand.imageUrl, API_BASE_URL).href}
                    alt={brand.name}
                    height={80}
                    width={80}
                    className={`object-contain max-h-16 transition-all duration-300 ${
                      isHovered === brand._id ? "scale-110" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
