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
import { FaAngleDown } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { login } from "@/apiServices/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";


export default function Header({ phoneNumber, categories }) {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef(null);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const topCategories = categories ? categories.slice(0, 10) : [];
  const recaptchaRef = useRef(null);
  const router = useRouter();
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const renderUserSection = () => {


    // Sitekey cứng
    const siteKey =
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
      "6LctBX4rAAAAAG6VSsWFH7ei2f1GZNooCwA-Mflp";

    // Hàm toggle password
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    // Reset recaptcha
    const resetRecaptcha = () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken("");
    };

    // Validate form đăng nhập
    const validateLoginForm = () => {
      const newErrors = {};

      if (!loginEmail.trim()) {
        newErrors.email = "Please fill out this field";
      } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
        newErrors.email = "Please include an @ in the email address";
      }

      if (!loginPassword.trim()) {
        newErrors.password = "Please fill out this field";
      }

      if (!recaptchaToken) {
        newErrors.recaptcha = "Vui lòng xác minh reCAPTCHA";
      }

      setLoginErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Handle login - SỬA LẠI PHẦN NÀY
    const handleLogin = async (e) => {
      e.preventDefault();

      if (!validateLoginForm()) return;

      setIsLoginSubmitting(true);

      try {
        // SỬ DỤNG HÀM login CÓ SẴN
        const response = await login(loginEmail, loginPassword, recaptchaToken);

        console.log('Login response:', response);

        if (response.success) {
          // LƯU THÔNG TIN USER
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          // CẬP NHẬT USER STATE
          setUser(response.data.user);

          setShowLoginBox(false);
          setRecaptchaToken("");
          if (recaptchaRef.current) recaptchaRef.current.reset();

          toast.success(response.message || "Đăng nhập thành công!");

          const userRole = response.data.user?.role;


          if (userRole === "admin" || userRole === "superadmin") {
            // Nếu là admin, chuyển sang trang admin
            router.push("/admin");
          } else {
            // Nếu là user thường, chuyển về trang chủ hoặc trang cá nhân
            router.push("/tai-khoan");
          }
        } else {
          throw new Error(response.message || "Đăng nhập thất bại");
        }
      } catch (error) {
        console.error('Login error:', error);

        // XỬ LÝ LỖI TỪ HÀM login
        const errorMessage = error.response?.data?.message || error.message || "Đăng nhập thất bại!";
        toast.error(errorMessage);

        resetRecaptcha();
      }

      setIsLoginSubmitting(false);
    };


    // Clear error khi user typing
    const handleLoginEmailChange = (e) => {
      setLoginEmail(e.target.value);
      if (loginErrors.email) setLoginErrors(prev => ({ ...prev, email: "" }));
    };

    const handleLoginPasswordChange = (e) => {
      setLoginPassword(e.target.value);
      if (loginErrors.password) setLoginErrors(prev => ({ ...prev, password: "" }));
    };

    // Clear recaptcha error
    const handleRecaptchaChange = (token) => {
      setRecaptchaToken(token || "");
      if (loginErrors.recaptcha) {
        setLoginErrors(prev => ({ ...prev, recaptcha: "" }));
      }
    };

    // Thêm: Load user từ localStorage khi component mount
    useEffect(() => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }, []);

    if (!isMounted) {
      return (
        <div className="flex items-center text-white">
          <User className="w-5 h-5" />
          <span className="ml-2 text-sm font-medium">Đăng nhập/Đăng ký</span>
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
              {/* HIỂN THỊ ĐÚNG THÔNG TIN USER */}
              {user.userName || user.name || user.email || "Tài khoản"}
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
              <button
                onClick={() => {
                  // Xóa thông tin user khi logout
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('user');
                  setUser(null);
                  setIsDropdownOpen(false);
                }}
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
        <div className="relative">
          <button
            onClick={() => setShowLoginBox(!showLoginBox)}
            className="flex items-start text-white px-3 py-2 rounded hover:bg-white/10 transition-colors duration-200"
          >
            <User className="w-7 h-10 mt-0.5" />
            <div className="flex flex-col ml-2">
              <span className="text-sm font-medium">Đăng nhập / Đăng ký</span>
              <span className="flex items-center text-sm font-medium mt-0.25">
                Tài khoản của tôi <FaAngleDown className="ml-1 w-3 h-3" />
              </span>
            </div>
          </button>

          {showLoginBox && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white p-4 rounded-lg shadow-lg z-50">
              <h2 className="text-lg font-normal mb-2 text-center text-[#263B96]">
                ĐĂNG NHẬP TÀI KHOẢN
              </h2>

              <p className="text-gray-600 mb-3 text-sm text-center">
                Nhập email và mật khẩu của bạn:
              </p>

              <div className="w-70 h-px bg-gray-300 mx-auto mb-4"></div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={handleLoginEmailChange}
                    className={`w-full max-w-[350px] border px-3 py-2 rounded-none ${loginErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>}
                </div>

                <div className="mb-3 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={loginPassword}
                    onChange={handleLoginPasswordChange}
                    className={`w-full border px-3 py-2 rounded-none pr-10 appearance-none ${loginErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>}
                </div>

                {/* ReCAPTCHA */}
                <div className="mb-3">
                  <div className="flex justify-center scale-95 transform origin-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={siteKey}
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                  {loginErrors.recaptcha && (
                    <p className="text-red-500 text-xs mt-1 text-center">
                      {loginErrors.recaptcha}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="mt-4 w-full font-bold py-4 rounded text-xs text-white relative overflow-hidden bg-black group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="absolute inset-0 bg-red-500 -translate-x-full transition-transform duration-200 ease-linear group-hover:translate-x-0 group-disabled:translate-x-0"></span>
                  <span className="relative z-10">
                    {isLoginSubmitting ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                  </span>
                </button>
              </form>

              <div className="flex flex-col space-y-0.5 mt-4 text-sm">
                <p className="text-gray-500">
                  Khách hàng mới? <a href="/dang-ky" className="text-[#263B96] hover:underline">Tạo tài khoản</a>
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <header className="bg-[#263B96] shadow top-0 z-50 relative">
      {/* hotline-only desktop */}
      <div className="hidden md:block w-full bg-black">
        <div className="max-w-7xl mx-auto py-1 px-4 flex items-center justify-start">
          <div className="hidden md:flex items-center text-sm space-x-1 -ml-14">
            <span className="font-semibold text-gray-300">Hotline:</span>
            <span className="text-white font-medium">
              {phoneNumber}
            </span>
            <span className="text-white font-medium">
              (9h-12h,13h00-18h,T2-T6)
            </span>
          </div>
        </div>
      </div>

      {/* Main header with padding for mobile */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-3 px-4 md:px-0">
        {/* Top section for mobile (logo + category menu + cart) */}
        <div className="w-full md:w-auto flex items-center justify-between mb-0">
          <Link href="/" className="flex-shrink-0 md:-ml-10">
            <Image
              src="/images/wellhome-logo-white.png"
              alt="WellHome Logo"
              width={220}
              height={37.69}
              className="h-auto"
              priority
            />
          </Link>

          {/* Mobile actions - Category menu icon, cart and user icon */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Category Menu on mobile - chỉ hiển thị icon */}
            <CategoryMenu categories={categories} isMobile={true} />

            <Link href="/gio-hang" className="text-white">
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

        <div className="w-full flex flex-col md:flex-row md:items-center md:space-x-6 md:ml-10">
          {/* Search bar - full width on mobile with proper spacing */}
          <div className="flex-1 mx-0 md:mx-20 mt-3 md:mt-0">
            <SearchComponent />
          </div>

          {/* Right action items - desktop only */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Dynamic user section based on login status */}
            <div className="w-px h-6 bg-gray-400 "></div>
            {renderUserSection()}
            <div className="w-px h-6 bg-gray-400"></div>
            <CartHeader />
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

      {/* Category menu - desktop only */}
      <div className="hidden md:block bg-white shadow">
        <div className="max-w-[250px] mr-auto  border border-gray-300 bg-white p-0">
          <CategoryMenu categories={categories} isMobile={false} />
        </div>
      </div>



    </header>
  );
}