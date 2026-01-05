"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { AiOutlineLoading } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { signup } from "@/apiServices/auth";
import { toast } from "react-toastify";
import { validatePassword } from "@/utils/password";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isPasswordMatch = password === confirmPassword && password !== "";

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Mật khẩu chưa đủ mạnh. Vui lòng kiểm tra các yêu cầu.");
      return;
    }

    setLoading(true);
    try {
      const response = await signup(email, username, password, phone);
      if (response.success) {
        toast.success(
          response.message || "Đăng ký thành công! Vui lòng đăng nhập."
        );
        router.push("/dang-nhap");
      } else {
        toast.error(response.message || "Đăng ký thất bại! Vui lòng thử lại");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bepanphu - Đăng ký</title>
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mx-4">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[600px]">
              <Image
                src="/images/online-kitchen-design.png"
                alt="Kitchen illustration"
                fill
                className="object-cover"
                priority
              />
            </div> */}

            {/* Right side - Form */}
            <div className="w-full p-8 flex flex-col justify-center">
              {/* <div className="flex justify-end mb-6">
                <div className="flex items-center">
                  <BsCart4 size={24} className="text-blue-600 mr-2" />
                  <span className="font-bold">Bepanphu</span>
                </div>
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
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                </div>

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
                      onBlur={() => setPasswordTouched(true)}
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

                  {/* Password strength indicator */}
                  {passwordTouched && password && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Yêu cầu mật khẩu:
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          {passwordValidation.length ? (
                            <FiCheck className="text-green-500 mr-2" />
                          ) : (
                            <FiX className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              passwordValidation.length
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Ít nhất 8 ký tự
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          {passwordValidation.uppercase ? (
                            <FiCheck className="text-green-500 mr-2" />
                          ) : (
                            <FiX className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              passwordValidation.uppercase
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Ít nhất một chữ cái in hoa (A-Z)
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          {passwordValidation.lowercase ? (
                            <FiCheck className="text-green-500 mr-2" />
                          ) : (
                            <FiX className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              passwordValidation.lowercase
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Ít nhất một chữ cái thường (a-z)
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          {passwordValidation.number ? (
                            <FiCheck className="text-green-500 mr-2" />
                          ) : (
                            <FiX className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              passwordValidation.number
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Ít nhất một số (0-9)
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          {passwordValidation.special ? (
                            <FiCheck className="text-green-500 mr-2" />
                          ) : (
                            <FiX className="text-red-500 mr-2" />
                          )}
                          <span
                            className={
                              passwordValidation.special
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            Ít nhất một ký tự đặc biệt (!@#$%^&*)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setConfirmPasswordTouched(true)}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${confirmPasswordTouched &&
                        confirmPassword &&
                        !isPasswordMatch
                        ? "border-red-500"
                        : confirmPasswordTouched && isPasswordMatch
                          ? "border-green-500"
                          : ""
                        }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {confirmPasswordTouched && confirmPassword && (
                    <div className="mt-1 flex items-center text-xs">
                      {isPasswordMatch ? (
                        <>
                          <FiCheck className="text-green-500 mr-1" />
                          <span className="text-green-600">Mật khẩu khớp</span>
                        </>
                      ) : (
                        <>
                          <FiX className="text-red-500 mr-1" />
                          <span className="text-red-600">
                            Mật khẩu không khớp
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
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

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading || !isPasswordValid || !isPasswordMatch}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-white focus:outline-none focus:ring focus:ring-blue-200 transition-all duration-200
                      ${loading || !isPasswordValid || !isPasswordMatch
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading && <AiOutlineLoading className="animate-spin" />}
                    <span>{loading ? "Đang đăng ký..." : "Đăng ký"}</span>
                  </button>
                </div>
              </form>

              <p className="mt-4 text-center text-sm text-gray-600">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/dang-nhap"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

