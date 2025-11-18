"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  MapPin,
  ShoppingCart,
  User,
  LogOut,
  UserCircle,
  ChevronDown,
  Package,
} from "lucide-react";
import CategoryMenu from "./CategoryHeader/Category";
import CartHeader from "./CartHeader";
import SearchComponent from "./SearchComponent";
import { isTokenExpired } from "@/utils/authenticate";
import { MenuTop } from "./MenuTop/MenuTop";

export default function Header({ phoneNumber, categories }) {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef(null);

  const topCategories = categories ? categories.slice(0, 10) : [];

  useEffect(() => {
    setIsMounted(true);

    // Check if user is logged in by checking localStorage
    const refreshToken = localStorage.getItem("refreshToken");
    const userData = JSON.parse(localStorage.getItem("user"));
    const expiredRefreshToken = isTokenExpired(refreshToken);
    if (!expiredRefreshToken && userData && userData.role === "user") {
      try {
        setUser(userData);
      } catch (error) {
        setUser(true);
      }
    }
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsDropdownOpen(false);

    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderUserSection = () => {
    if (!isMounted) {
      return (
        <div className="flex items-center text-white">
          <User className="w-5 h-5" />
          <span className="ml-2 text-sm font-medium">Đăng nhập</span>
        </div>
      );
    }

    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center text-white hover:text-gray-200"
          >
            <UserCircle className="w-6 h-6" />
            <span className="ml-2 text-sm font-medium hidden md:inline">
              {user.userName || "Tài khoản"}
            </span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link
                href="/tai-khoan"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserCircle className="inline-block w-4 h-4 mr-2" />
                Tài khoản
              </Link>
              {/* <Link
                href="/don-hang"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Package className="inline-block w-4 h-4 mr-2" />
                Đơn hàng
              </Link> */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="inline-block w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          href="/dang-nhap"
          className="flex items-center text-white hover:text-gray-200"
        >
          <User className="w-5 h-5" />
          <span className="ml-2 text-sm font-medium">Đăng nhập</span>
        </Link>
      );
    }
  };

  return (
    <header className="bg-primary shadow top-0 z-50 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-3">
        {/* Top section for mobile (logo + category menu + cart) */}
        <div className="w-full md:w-auto flex items-center justify-between mb-0">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/kitchen-care-logo.png"
              alt="Kitchen Care Logo"
              width={180}
              height={60}
              className="h-auto"
              priority
            />
          </Link>

          {/* Mobile actions - Category menu, cart and user icon */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="mr-2">
              <CategoryMenu categories={categories} />
            </div>
            <Link href="/cart" className="text-white">
              <ShoppingCart className="w-6 h-6" />
            </Link>
            {!isMounted ? (
              <div className="text-white">
                <User className="w-6 h-6" />
              </div>
            ) : user ? (
              <div onClick={toggleDropdown} className="text-white">
                <UserCircle className="w-6 h-6" />
              </div>
            ) : (
              <Link href="/dang-nhap" className="text-white">
                <User className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row md:items-center md:space-x-6">
          {/* Category menu - desktop only */}
          <div className="hidden md:block">
            <CategoryMenu categories={categories} />
          </div>

          {/* Search bar - full width on mobile */}
          <SearchComponent />

          {/* Right action items - desktop only */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href={phoneNumber ? `tel:${phoneNumber}` : "#"}
              className="flex items-center text-white hover:text-gray-200"
            >
              <Phone className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">
                {phoneNumber ? phoneNumber : "Loading..."}
              </span>
            </Link>

            <Link
              href="/showrooms"
              className="flex items-center text-white hover:text-gray-200"
            >
              <MapPin className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">
                Hệ thống showroom
              </span>
            </Link>

            <CartHeader />

            <Link
              href="/don-hang"
              className="flex items-center text-white hover:text-gray-200"
            >
              <Package className="w-5 h-5" />
               <span className="ml-2 text-sm font-medium">
                Đơn hàng
              </span>
            </Link>

            {/* Dynamic user section based on login status */}
            {renderUserSection()}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu - shown when user is logged in and clicks profile icon */}
      {isMounted && user && isDropdownOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-50">
          <Link
            href="/tai-khoan"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsDropdownOpen(false)}
          >
            <UserCircle className="inline-block w-4 h-4 mr-2" />
            Tài khoản
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="inline-block w-4 h-4 mr-2" />
            Đăng xuất
          </button>
        </div>
      )}

      <MenuTop categories={topCategories} />
    </header>
  );
}
