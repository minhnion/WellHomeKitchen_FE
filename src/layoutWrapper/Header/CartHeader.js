"use client";

import { ShoppingBag } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { getCartItemsLS } from "@/utils/cartUtils";
import { useRouter } from "next/navigation";

export default function CartHeader() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const router = useRouter();

  const updateCart = async () => {
    const cartItems = await getCartItemsLS();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + ((item.price ?? item.product?.price ?? 0) * item.quantity),
      0
    );

    setItems(cartItems);
    setCount(cartCount);
    setTotal(cartTotal);
  };

  useEffect(() => {
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cart-updated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  const togglePopup = () => {
    setShowCartPopup((prev) => !prev);
  };

  const goToCart = () => {
    setShowCartPopup(false);
    router.push("/gio-hang");
  };

  return (
    <div className="relative flex items-center">
      {/* ICON Giỏ hàng */}
      <div
        className="relative cursor-pointer"
        onClick={togglePopup}
      >
        <ShoppingBag className="w-6 h-6 text-white/70" />

        {/* Badge số lượng */}
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
          {count}
        </span>

        {/* Popup */}
        {showCartPopup && (
          <div className="absolute top-full right-1/2 translate-x-1/2 mt-2 w-96 max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-md p-5 z-50 text-gray-800">
            {/* Tiêu đề popup */}
            <div className="text-lg font-medium text-[#5E6EB1] text-center mb-2">
              GIỎ HÀNG
            </div>

            <div className="border-t border-gray-300 mb-4"></div>

            {/* Danh sách sản phẩm hoặc thông báo */}
            {count === 0 ? (
              <div className="flex flex-col items-center text-gray-500 text-base mb-4">
                <ShoppingCart className="w-10 h-10 text-[#5E6EB1]" />
                <span className="mt-2">Hiện chưa có sản phẩm</span>
              </div>
            ) : (
              <div className="space-y-3 mb-4 text-base">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} x {(item.price ?? item.product?.price).toLocaleString()}₫
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tổng tiền */}
            <div className="border-t border-gray-300 pt-2 flex justify-between items-center font-semibold text-base">
              <span>TỔNG TIỀN:</span>
              <span className="text-red-500 font-semibold">{total.toLocaleString()}₫</span>

            </div>

            {/* Nút xem giỏ hàng */}
            <button
              onClick={goToCart}
              className="block mt-4 w-full text-center bg-[#FF0000] text-white py-3 rounded-md hover:bg-[#FF0000] text-lg font-medium"
            >
              Xem giỏ hàng
            </button>

          </div>
        )}
      </div>

      {/* Chữ Giỏ hàng bên cạnh icon -> bấm cũng toggle popup */}
      <div
        className="ml-2 text-sm font-medium text-white cursor-pointer select-none"
        onClick={togglePopup}
      >
        Giỏ hàng
      </div>
    </div>
  );
}
