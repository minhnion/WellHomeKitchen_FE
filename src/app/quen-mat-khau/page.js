"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { checkEmailExists, sendResetPasswordEmail } from "@/apiServices/auth";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailChecked, setEmailChecked] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!email) {
            toast.error("Vui lòng nhập email của bạn");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            // Kiểm tra xem email có tồn tại trong hệ thống không
            const emailExists = await checkEmailExists(email);

            if (!emailExists) {
                toast.error("Email này chưa được đăng ký trong hệ thống");
                setLoading(false);
                return;
            }

            // Nếu email tồn tại, gửi email reset mật khẩu
            const response = await sendResetPasswordEmail(email);

            if (response.success) {
                toast.success("Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn.");
                setEmailChecked(true);
                // Có thể chuyển hướng hoặc hiển thị thông báo thành công
                setTimeout(() => {
                    router.push("/dang-nhap");
                }, 3000);
            } else {
                toast.error(response.message || "Có lỗi xảy ra khi gửi email");
            }

        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Kiểm tra email real-time khi người dùng nhập xong
    const handleEmailBlur = async () => {
        if (!email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return;
        }

        try {
            const exists = await checkEmailExists(email);
            if (!exists) {
                // Có thể hiển thị cảnh báo nhưng không chặn người dùng
                console.log("Email chưa được đăng ký");
            }
        } catch (error) {
            console.error("Lỗi kiểm tra email:", error);
        }
    };

    return (
        <>
            <Head>
                <title>Quên mật khẩu</title>
            </Head>

            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
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
                                className="text-2xl font-bold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Đăng ký
                            </Link>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleEmailBlur}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Vui lòng nhập email của bạn"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Chúng tôi sẽ gửi link đặt lại mật khẩu đến email này
                            </p>
                        </div>

                        {/* reCAPTCHA and Terms */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 text-center">
                                This site is protected by reCAPTCHA and the Google{" "}
                                <a href="#" className="text-blue-600 hover:underline font-medium">
                                    Privacy Policy
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-blue-600 hover:underline font-medium">
                                    Terms of Service
                                </a>{" "}
                                apply.
                            </p>
                        </div>



                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-white text-lg transition-all duration-200 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-800"
                                }`}
                        >
                            {loading && <AiOutlineLoading className="animate-spin" />}
                            <span>{loading ? "ĐANG KIỂM TRA..." : "GỬI EMAIL"}</span>
                        </button>
                    </form>

                    {/* Back to login link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            <Link
                                href="/dang-nhap"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Quay lại đăng nhập
                            </Link>
                        </p>
                    </div>

                    {/* Thông báo thành công */}
                    {emailChecked && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600 text-center">
                                ✓ Đã gửi email thành công! Vui lòng kiểm tra hộp thư của bạn.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}