"use client";

import React, { useState } from "react";
import { API_BASE_URL } from "@/apiServices/constants";
import Link from "next/link";
import { Sparkles, Star, Eye, X } from "lucide-react";
import EnhancedLabel from "./EnhancedLabel";
import { ShoppingBag } from "lucide-react";
import { addToCartLS } from "@/utils/cartUtils";





const ProductCard = ({
  id = "",
  mainImage = "",
  galleryImages = [],
  slug = "",
  name = "",
  price = 0,
  discountPercent = 0,
  createdAt,
  isSpecial = false,
  subCategory,
  label = "",
  brand = null,
  starAverage = 4.5,
  numberOfReviews = 0,
}) => {
  const [showEye, setShowEye] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = [mainImage, ...(galleryImages || [])];
  // reset mỗi khi mở modal
  const openModal = (e) => {
    e.preventDefault();
    setCurrentImage(0);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    try {
      addToCartLS({
        id,
        name,
        price,
        discountPercent,
        image: mainImage,
        slug,
        quantity,
      });

      window.dispatchEvent(new Event("cart-updated"));

      setTimeout(() => setIsAdding(false), 500);
    } catch (err) {
      console.error(err);
      setIsAdding(false);
    }
  };

  const truncatedTitle = name.length > 35 ? name.slice(0, 35) + "..." : name;

  const isNew =
    new Date(createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newPrice = price + (price * discountPercent) / 100;
  const truncatedOldPrice = price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const truncatedNewPrice = newPrice
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const star = starAverage > 0 ? starAverage : 4.5;

  return (
    <>
      <div
        className="flex flex-col justify-between bg-white  shadow-md m-1 overflow-hidden w-55 aspect-[9/17] border border-gray-200 max-xl:w-48 max-sm:w-44 max-[25rem]:w-40 transition-shadow duration-300 hover:shadow-xl group relative"
        onMouseEnter={() => setShowEye(true)}
        onMouseLeave={() => setShowEye(false)}
      >
        <Link
          href={`/san-pham/${slug}`}
          className="relative cursor-pointer block"
        >
          <div className="absolute max-sm:top-1 top-2.5 left-3 flex flex-wrap gap-1.5 z-100">
            {isNew && (
              <span className="max-sm:text-[9px] z-100 border border-blue-500 text-blue-500 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm flex items-center bg-white/80 backdrop-blur-sm">
                <span className="absolute -top-1.5 -left-1.75">
                  <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500 stroke-blue-600" />
                </span>
                Mới
              </span>
            )}


          </div>

          <div className="relative overflow-hidden">
            {/* Image wrapper  */}
            <div className="
  relative w-full
  h-60            /* desktop */
  max-xl:h-52
  max-sm:h-48
  max-[25rem]:h-44
  px-4 max-sm:px-2 pt-5 pb-1
">
              {/* Nút mắt ở TRUNG TÂM ảnh */}
              {showEye && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/10">
                  <button
                    onClick={openModal}
                    className="
        w-8 h-8
        flex items-center justify-center
        rounded-full
        bg-white/90
        text-gray-700
        shadow-lg
        backdrop-blur-sm

        transition-all
        duration-200
        hover:bg-white
        hover:scale-110

        active:bg-gray-300
        active:scale-95
      "
                  >
                    <Eye className="w-6 h-6" />
                  </button>
                </div>
              )}


              <img
                src={`${API_BASE_URL}${mainImage}`}
                alt={name}
                className="absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-out group-hover:-translate-x-full group-hover:opacity-0"
              />

              {galleryImages?.[0] && (
                <img
                  src={`${API_BASE_URL}${galleryImages[0]}`}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-contain translate-x-full opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                />
              )}
            </div>

            <div className="absolute bottom-0 left-3 transform translate-y-1/3">
              {label && <EnhancedLabel label={label} />}
            </div>
          </div>

          <div className="px-3 ">
            <h3
              title={name}
              className="h-10 text-base mb-2 text-gray-800 max-sm:text-[13px] max-sm:h-7"
            >
              {truncatedTitle}
            </h3>

            <div className="flex flex-col items-start my-3">
              <span className="text-xl font-bold text-red-600 max-sm:text-lg">
                {truncatedOldPrice}
                <span className="underline">đ</span>
              </span>
              <div className="flex justify-between items-center w-full">
                {discountPercent > 0 && (
                  <span className="text-sm text-gray-500 line-through max-sm:text-xs">
                    {truncatedNewPrice}
                    <span className="underline">đ</span>
                  </span>
                )}

                {discountPercent > 0 && (
                  <span
                    className="
      bg-red-500 text-white
      text-[12px] max-sm:text-[9px]
      font-semibold
      px-2 py-1          
      rounded-md         
      shadow
      leading-none
      shrink-0
    "
                  >
                    -{discountPercent}%
                  </span>
                )}

              </div>

            </div>
          </div>
        </Link>
        <div className="px-2 pb-3 mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="
      group
      relative
      w-full
      h-11
      flex items-center
      overflow-hidden
      rounded-full
      disabled:opacity-70
    "
          >
            {/* RIPPLE TRÒN LAN RA VỪA ĐỦ */}
            <span
              className="
  absolute
  left-2
  top-1/2
  -translate-y-1/2
  w-9 h-9
  rounded-full
  bg-blue-800
  transition-all
  duration-500
  ease-out
  group-hover:w-[170px]
  group-hover:h-[40px]
"

            />

            {/* ICON */}
            <span
              className="
        relative z-10
        ml-2
        w-9 h-9
        flex items-center justify-center
        rounded-full
        bg-blue-800
        text-white
        transition-transform
        duration-300
        group-hover:scale-110
      "
            >
              <ShoppingBag size={16} />
            </span>

            {/* TEXT */}
            <span
              className="
        relative z-10
        ml-3
        text-xs
        font-semibold
        text-black
        transition-colors
        duration-300
        group-hover:text-white
        whitespace-nowrap
      "
            >
              {isAdding ? "ĐANG THÊM..." : "THÊM VÀO GIỎ"}
            </span>
          </button>
        </div>



      </div>


      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center  ">

              <button
                onClick={() => setShowModal(false)}
                className="
    ml-auto
    p-2
    rounded-full
    text-gray-500
    hover:bg-gray-100
    hover:text-gray-800
    transition
  "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div>
                {/* ẢNH LỚN */}
                <div className="relative mb-4">
                  <img
                    src={`${API_BASE_URL}${images[currentImage]}`}
                    alt={name}
                    className="w-full h-64 object-contain bg-gray-50 rounded-lg"
                  />

                  {/* Nút PREV */}
                  <button
                    onClick={() =>
                      setCurrentImage((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                  >
                    ❮
                  </button>

                  {/* Nút NEXT */}
                  <button
                    onClick={() =>
                      setCurrentImage((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                  >
                    ❯
                  </button>
                </div>


                {/* ảnh nhỏ*/}
                <div className="flex gap-2">
                  {galleryImages?.map((img, index) => (
                    <img
                      key={index}
                      src={`${API_BASE_URL}${img}`}
                      alt={`${name} ${index + 1}`}
                      onClick={() => setCurrentImage(index + 1)}
                      className={`
        w-20 h-20 object-contain bg-gray-50 rounded border cursor-pointer
        ${currentImage === index + 1 ? "border-blue-500" : "border-gray-200"}
      `}
                    />
                  ))}
                </div>

              </div>


              {/* Cột thông tin */}
              <div>
                <div className="mb-4">
                  <p className="text-lg font-semibold text-blue-900 mb-1">{name}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    Mã sản phẩm:{" "}
                    <span className="text-blue-800 font-medium">
                      {id}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Thương hiệu:{" "}
                    <span className="font-medium text-blue-800">
                      {brand?.name || "Đang cập nhật"}
                    </span>
                  </p>

                </div>

                <div className="mb-6">

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800 text-medium">Giá:</span>
                    <span className="text-medium font-bold text-red-600">
                      {truncatedOldPrice}đ
                    </span>
                    {discountPercent > 0 && (
                      <>
                        <span className="text-medium text-gray-500 line-through">
                          {truncatedNewPrice}đ
                        </span>
                        <span className="px-2 py-1 bg-white-100 text-red-700 rounded text-sm  border border-red-500">
                          -{discountPercent}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="my-6 flex items-center gap-4">
                  <h3 className="font-bold text-gray-800 whitespace-nowrap">
                    Số lượng:
                  </h3>

                  <div className="flex items-center border rounded w-20 h-9">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="flex-1 text-center">{quantity}</span>

                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>


                <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded"
                >
                  THÊM VÀO GIỎ
                </button>



                <div>
                  <Link href={`/san-pham/${slug}`}>
                    <button className="text-gray-600  font-medium text-xs">
                      Xem chi tiết sản phẩm &gt;
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;