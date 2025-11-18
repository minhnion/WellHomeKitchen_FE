"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { getCartCountLS } from "@/utils/cartUtils";

export default function CartHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const cartCount = getCartCountLS();
      setCount(cartCount);
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cart-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-updated", update);
    };
  }, []);

  return (
    <Link
      href="/gio-hang"
      className="flex items-center text-white hover:text-gray-200 relative group"
    >
      <ShoppingCart className="w-5 h-5" />
      <span className="ml-2 text-sm font-medium">Giỏ hàng</span>
      <span className="ml-1 text-xs font-medium text-white bg-red-500 rounded-full px-1 absolute top-0 right-0 transform translate-x-[80%] -translate-y-[60%]">
        {count}
      </span>
    </Link>
  );
}
