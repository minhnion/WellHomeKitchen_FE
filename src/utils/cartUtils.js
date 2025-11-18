"use client";

import {
  addItemToCart,
  getCartDetail,
  updateCartItemQuantity,
  deleteItemsFromCart,
} from "@/apiServices/cart";
import { toast } from "react-toastify";

async function syncCartWithServer() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;

  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const selectedProduct = cartItems.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));
  for (const item of selectedProduct) {
    console.log("Syncing item:", item);
    await updateCartItemQuantity(item.productId, item.quantity);
  }
}

export async function addToCartLS(product, quantity = 1) {
  // Get existing cart or initialize empty array
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

  // Check if product already exists in cart
  const existingItemIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (existingItemIndex >= 0) {
    // Update quantity if product already in cart
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cartItems.push({
      ...product,
      quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    await addItemToCart(product.id, quantity);
  } else {
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  }
  return cartItems;
}

export async function getCartItemsLS() {
  if (typeof window === "undefined") return [];
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    await syncCartWithServer();
    const responseData = await getCartDetail();
    localStorage.setItem("cart", JSON.stringify(responseData));
    return responseData;
  }
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function getCartCountLS() {
  if (typeof window === "undefined") return 0;
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export async function removeFromCartLS(productId) {
  const cartItems = await getCartItemsLS();
  if (!cartItems) return;
  const cart = await cartItems;
  const existingItemIndex = cart.findIndex((item) => item.id === productId);
  if (existingItemIndex < 0) return;
  const updatedCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  if (localStorage.getItem("accessToken")) {
    await deleteItemsFromCart([productId]);
  } else {
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  }
  return updatedCart;
}

export async function removeAllFromCartLS() {
  localStorage.removeItem("cart");
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    await deleteItemsFromCart([]);
  }
  return [];
}
