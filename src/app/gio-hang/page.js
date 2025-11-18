"use client";

import { useState, useEffect } from "react";
import { getCartItemsLS, removeFromCartLS } from "@/utils/cartUtils";
import Image from "next/image";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { API_BASE_URL } from "@/apiServices/constants";
import { updateCartItemQuantity } from "@/apiServices/cart";
import { ToastContainer } from "react-toastify";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCart() {
      try {
        // setIsLoading(true);
        const items = await getCartItemsLS();
        items?.forEach((item) => {
          if (item.price && item.discountPercent) {
            item.price = item.price - (item.price * item.discountPercent) / 100;
          }
        });
        console.log("Cart items:", items);
        setCartItems(items || []);

        const initialSelected = {};
        items?.forEach((item) => {
          initialSelected[item.id] = true;
        });
        setSelectedItems(initialSelected);
        setIsAllSelected(items?.length > 0);
        // setIsLoading(false);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }

    fetchCart();

    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await updateCartItemQuantity(id, newQuantity);
      }
      window.dispatchEvent(new Event("cart-updated"));
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
        const updatedCart = await removeFromCartLS(id);
        setCartItems(updatedCart);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSelectAll = () => {
    const newIsAllSelected = !isAllSelected;
    setIsAllSelected(newIsAllSelected);

    const newSelectedItems = {};
    cartItems.forEach((item) => {
      newSelectedItems[item.id] = newIsAllSelected;
    });
    setSelectedItems(newSelectedItems);
  };

  const getSelectedItems = () =>
    cartItems.filter((item) => selectedItems[item.id]);

  const calculateTotal = () => {
    return getSelectedItems().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 max-w-6xl py-8 text-center">
        <ToastContainer />
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <FiShoppingBag className="mx-auto text-gray-300 text-5xl md:text-6xl mb-4" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            Đang tải giỏ hàng
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Vui lòng đợi trong giây lát...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <Link
            href="/"
            className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-6xl py-8 md:py-12 text-center">
        <ToastContainer />
        <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
          <FiShoppingBag className="mx-auto text-gray-300 text-5xl md:text-6xl mb-4" />
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            Giỏ hàng trống
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            Không có sản phẩm nào trong giỏ hàng của bạn.
          </p>
          <Link
            href="/san-pham"
            className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-md hover:bg-blue-700 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 max-w-6xl py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-gray-800">
        Giỏ hàng của bạn
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-3 md:p-4 border-b flex items-center">
              <div className="w-6">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-blue-600"
                />
              </div>
              <div className="flex-1 ml-3 md:ml-4 font-medium text-sm md:text-base text-gray-700">
                Chọn tất cả ({cartItems.length} sản phẩm)
              </div>
            </div>

            {/* Items */}
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 md:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center hover:bg-gray-50"
                >
                  <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="w-6">
                      <input
                        type="checkbox"
                        checked={!!selectedItems[item.id]}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </div>
                    <div className="w-16 md:w-20 h-16 md:h-20 ml-3 md:ml-4 relative flex-shrink-0">
                      <Image
                        src={new URL(item.mainImage, API_BASE_URL).href}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                      />
                    </div>
                  </div>

                  <div className="flex-1 px-0 sm:px-4 ml-9 sm:ml-0">
                    <h3 className="text-sm md:text-base text-gray-800 font-medium line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0 ml-9 sm:ml-0">
                    <div className="flex items-center border rounded">
                      <button
                        className="px-2 md:px-3 py-1 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <FiMinus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-8 md:w-12 text-center border-0 focus:ring-0 text-sm"
                      />
                      <button
                        className="px-2 md:px-3 py-1 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px] md:min-w-[120px]">
                      <div className="text-blue-600 font-medium text-sm md:text-base">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </div>
                      {item.originalPrice > item.price && (
                        <div className="text-xs md:text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4 md:top-8">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              Tóm tắt đơn hàng
            </h2>

            <div className="border-t border-b py-3 md:py-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm md:text-base text-gray-600">
                  Số lượng sản phẩm:
                </span>
                <span className="text-sm md:text-base">
                  {getSelectedItems().reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm md:text-base text-gray-600">
                  Tạm tính:
                </span>
                <span className="text-sm md:text-base font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(calculateTotal())}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-base md:text-lg font-semibold mb-4 md:mb-6">
              <span>Tổng tiền:</span>
              <span className="text-blue-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(calculateTotal())}
              </span>
            </div>

            <Link
              href={
                getSelectedItems().length > 0
                  ? `/mua-hang?ids=${getSelectedItems()
                      .map((item) => item.id)
                      .join(",")}&quantitys=${getSelectedItems()
                      .map((item) => item.quantity)
                      .join(",")}`
                  : "#"
              }
              className={`block w-full py-2 md:py-3 text-center rounded-md ${
                getSelectedItems().length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } text-sm md:text-base font-medium transition`}
              onClick={(e) => {
                if (getSelectedItems().length === 0) {
                  e.preventDefault();
                }
              }}
            >
              Tiến hành thanh toán
            </Link>

            <Link
              href="/"
              className="block w-full mt-3 md:mt-4 py-2 md:py-3 text-center border border-blue-600 text-blue-600 text-sm md:text-base rounded-md hover:bg-blue-50 transition"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
