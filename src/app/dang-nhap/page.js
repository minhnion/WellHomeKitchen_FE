"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { login } from "@/apiServices/auth";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const recaptchaRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    "6LctBX4rAAAAAG6VSsWFH7ei2f1GZNooCwA-Mflp";

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const resetRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setRecaptchaToken("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!recaptchaToken) {
      toast.error("Vui lòng xác minh reCAPTCHA");
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password, recaptchaToken);
      if (response.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success(response.message || "Đăng nhập thành công!");
        const redirectPath =
          response.data.user.role === "user" ? "/" : "/admin";
        window.location.href = redirectPath;
      } else {
        toast.error(response.message || "Đăng nhập thất bại! Vui lòng thử lại");
        resetRecaptcha();
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(msg);
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Kitchen Care - Đăng nhập</title>
      </Head>

      {/* Load reCAPTCHA script */}
      {siteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=explicit`}
          strategy="afterInteractive"
        />
      )}

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mx-4">
          <div className="flex flex-col md:flex-row">
            {/* <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[500px]">
              <Image
                src="/images/online-kitchen-design.png"
                alt="Kitchen illustration"
                fill
                className="object-cover"
                priority
              />
            </div> */}

            <div className="w-full  p-8 flex flex-col justify-center">
              {/* <div className="flex justify-end mb-6">
                <div className="flex items-center">
                  <BsCart4 size={24} className="text-blue-600 mr-2" />
                  <span className="font-bold">Kitchen Care</span>
                </div>
              </div> */}

              {/* <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-1">Chào mừng trở lại</h2>
                <p className="text-gray-500 text-sm">
                  Vui lòng đăng nhập vào tài khoản của bạn
                </p>
              </div> */}

              <div className="flex justify-center space-x-4 mb-4">
                <Link
                  href="/dang-nhap"
                  className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Đăng nhập
                </Link>
                <span className="text-2xl font-bold text-gray-300">|</span>
                <Link
                  href="/dang-ky"
                  className="text-2xl font-bold text-black"
                >
                  Đăng ký
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <p className=" text-xs text-gray-500">
                  This site is protected by reCAPTCHA and the Google{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 no-underline hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  apply.
                </p>

                <div className="my-4">
                  {siteKey && (
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={siteKey}
                      onChange={(token) => setRecaptchaToken(token || "")}
                    />
                  )}
                </div>

                {/* <div className="text-right">
                  <button
                    type="button"
                    onClick={() => router.push('/quen-mat-khau')}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Quên mật khẩu?
                  </button>
                </div> */}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-white focus:outline-none focus:ring focus:ring-blue-200 transition-all duration-200
                      ${loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading && <AiOutlineLoading className="animate-spin" />}
                    <span>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</span>
                  </button>
                </div>
              </form>

              {/* <div className="mt-6">
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="px-4 text-sm text-gray-500">
                    Hoặc đăng nhập với
                  </span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="mt-4 flex justify-between gap-4">
                  <button className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                    <FcGoogle size={20} className="mr-2" />
                    Google
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                    <FaFacebook size={20} className="mr-2 text-blue-600" />
                    Facebook
                  </button>
                </div>
              </div> */}

              <p className="mt-4 text-center text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Đăng ký
                </Link>
              </p>
              {/* <p className="mt-2 text-center text-sm text-gray-600">
                Bạn quên mật khẩu?{" "}
                <Link
                  href="/quen-mat-khau"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Quên mật khẩu
                </Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
