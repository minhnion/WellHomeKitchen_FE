"use client";
import {
  FiShoppingCart,
  FiCreditCard,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import { addToCartLS } from "@/utils/cartUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addProductViewHistory } from "@/utils/productViewHistoryUtils";
import { getConfigByKey } from "@/apiServices/config";


export default function CartButtons({ product }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zaloLink, setZaloLink] = useState("");


  useEffect(() => {
    const getConfig = async () => {
      const phone = await getConfigByKey("company_phone");
      const zalo = await getConfigByKey("zalo_link");
      setPhoneNumber(phone);
      setZaloLink(zalo);
    };
    getConfig();
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      // Add to localStorage
      addToCartLS(product);
      // Show success feedback
      setTimeout(() => setIsAdding(false), 500);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      setIsAdding(false);
    }
  };

  if (product?.id) {
    addProductViewHistory(product.id);
  }

  const handleBuyNow = () => {
    try {
      const productId = product.id;
      const quantity = 1;

      // Build URL with query parameters
      const checkoutUrl = `/mua-hang?ids=${productId}&quantitys=${quantity}`;

      // Redirect to checkout page
      router.push(checkoutUrl);
    } catch (error) {
      console.error("Error processing checkout:", error);
    }
  };

  const handleCallMe = () => {
    window.location.href = "tel:" + phoneNumber;
  };

  return (
    <div className="flex flex-col gap-3 mb-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="relative overflow-hidden border-2 border-red-600 rounded-lg font-medium 
             flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3
             text-red-600 text-sm sm:text-base
             transition-colors duration-300
             group"
        >
          <span
            className="absolute inset-0 bg-red-600 transform scale-x-0 origin-left
               transition-transform duration-300 ease-out
               group-hover:scale-x-100"
          ></span>
          <span className="relative z-10 flex items-center gap-2 group-hover:text-white">
            <FiShoppingCart size={18} className="flex-shrink-0" />
            {isAdding ? "Đang thêm..." : "THÊM VÀO GIỎ"}
          </span>
        </button>

        <button
          onClick={handleBuyNow}
          className="
    bg-red-600 text-white
    hover:bg-red-500
    px-3 py-2 sm:px-4 sm:py-3
    rounded-lg font-medium
    flex items-center justify-center gap-2
    transition-colors duration-300
    text-sm sm:text-base
  "
        >
          <FiCreditCard size={18} className="flex-shrink-0" />
          <span>MUA NGAY</span>
        </button>


      </div>

    </div>
  );
}