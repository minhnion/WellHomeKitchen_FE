import Link from "next/link";
import { CheckCircle, X, ChevronDown, Clock, CreditCard } from "lucide-react";
import CreateQrOrder from "@/components/CreaterQrOrder/CreaterQrOrder";
import { ToastContainer, toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import { updatePaymentStatusByUser, updatePaymentStatusByAnonymous } from "@/apiServices/order"; // Import API functions
import { getAnonymousId } from "@/utils/anonymousUtils"; // Import anonymous utils

const SuccessPopUp = ({
  isCloseHeader = true,
  orderCode,
  orderId, // Thêm orderId để gọi API
  total,
  paymentMethod,
  anonymousId, // Thêm anonymousId từ component cha
  setShowSuccessPopUp,
}) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const scrollContainerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Không lấy sau dấu phẩy
  const roundToTwoDecimals = (num) => {
    return Math.floor(num * 100) / 100;
  };

  const navigate = () => {
    window.location.href = "/don-hang";
  };

  const handleQrSuccess = () => {
    // Bắt đầu countdown khi QR được tạo thành công
    setIsCountdownActive(true);
    startCountdown();
  };

  const handleQrError = (error) => {
    toast.error(`Lỗi khi tạo QR: ${error.message}`);
  };

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id || null;
  };

  // Bắt đầu countdown
  const startCountdown = () => {
    setCountdown(15);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsCountdownActive(false);
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup countdown
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Xử lý hoàn tất thanh toán
  const handleCompletePayment = async () => {
    if (isUpdatingPayment) return;

    setIsUpdatingPayment(true);

    try {
      const userId = getUserId();
      let response;

      if (userId) {
        // Trường hợp có userId - sử dụng API cho user đã đăng nhập
        response = await updatePaymentStatusByUser(orderId, "paid", userId);
      } else {
        // Trường hợp không có userId - sử dụng API cho anonymous user
        const currentAnonymousId = anonymousId || getAnonymousId();
        response = await updatePaymentStatusByAnonymous(
          orderId, 
          "paid", 
          currentAnonymousId, 
          "bank_transfer", 
          `TXN_${Date.now()}`
        );
      }

      if (response && response.success) {
        setIsPaymentCompleted(true);
        toast.success("Đã xác nhận thanh toán thành công!");
      } else {
        toast.error(
          `Không thể xác nhận thanh toán: ${
            response?.message || "Vui lòng thử lại sau."
          }`
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error(`Lỗi cập nhật thanh toán: ${error.message}`);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [paymentMethod]);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={() => navigate()}
      />
      <ToastContainer />

      {/* Scrollable Modal Container */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl transform rounded-2xl bg-white shadow-2xl transition-all duration-300 animate-fadeIn max-h-[90vh] flex flex-col relative">
            {/* Scroll Indicator */}
            {showScrollIndicator && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Scrollable Content */}
            <div
              ref={scrollContainerRef}
              className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {/* Header */}
              <div className="relative p-6 sm:p-8">
                <button
                  onClick={() => navigate()}
                  className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                  {isCloseHeader ? (
                    <>
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-pulse-once">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h1 className="mb-4 text-2xl font-bold text-gray-800">
                        Đặt hàng thành công!
                      </h1>
                      <p className="mb-6 text-base text-gray-600">
                        Cảm ơn bạn đã đặt hàng tại Kitchen Care. Chúng tôi sẽ
                        liên hệ với bạn trong thời gian sớm nhất.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Payment Header with Icon */}
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 animate-pulse-once">
                        <CreditCard className="h-10 w-10 text-blue-600" />
                      </div>

                      <h1 className="mb-4 text-2xl font-bold text-gray-800">
                        Thanh toán cho đơn hàng #{orderCode}
                      </h1>

                      <p className="mb-6 text-base text-gray-600">
                        Vui lòng hoàn tất thanh toán để xác nhận đơn hàng của
                        bạn.
                      </p>
                    </>
                  )}
                  <div className="mb-6 w-full rounded-xl bg-gray-50 p-4 sm:p-6 text-left shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      Thông tin đơn hàng:
                    </h3>
                    <div className="space-y-2 text-base text-gray-600">
                      <p className="flex justify-between">
                        <span>Mã đơn hàng:</span>
                        <span className="font-medium">#{orderCode}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Tổng giá trị:</span>
                        <span className="font-medium">
                          {roundToTwoDecimals(total).toLocaleString()}₫
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span>Phương thức thanh toán:</span>
                        <span className="font-medium">
                          {paymentMethod === "cod"
                            ? "Thanh toán khi nhận hàng"
                            : "Chuyển khoản ngân hàng"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              {paymentMethod === "bank_transfer" && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Vui lòng chuyển khoản đến tài khoản ngân hàng sau để hoàn
                      tất đơn hàng:
                    </p>
                    <CreateQrOrder
                      amount={roundToTwoDecimals(total)}
                      orderInfo={`Đơn hàng #${orderCode}`}
                      orderId={orderCode}
                      onSuccess={handleQrSuccess}
                      onError={handleQrError}
                    />

                    {/* Payment Completion Status */}
                    {isCountdownActive && (
                      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                          <span className="text-yellow-800 font-medium">
                            Vui lòng đợi {countdown} giây để xác nhận thanh toán
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                            style={{
                              width: `${((15 - countdown) / 15) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {isPaymentCompleted && (
                      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">
                            Thanh toán đã được xác nhận thành công!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions - Fixed */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
              {paymentMethod === "cod" && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/don-hang"
                    onClick={() => setShowSuccessPopUp(false)}
                    className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Xem đơn hàng
                  </Link>
                  <Link
                    href="/ "
                    onClick={() => setShowSuccessPopUp(false)}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </Link>
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="space-y-3">
                  {/* Countdown and Payment Button */}
                  {!isCountdownActive && !isPaymentCompleted && (
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full py-3"
                      onClick={handleCompletePayment}
                      disabled={isUpdatingPayment}
                      sx={{
                        backgroundColor: "#2563eb",
                        "&:hover": {
                          backgroundColor: "#1d4ed8",
                        },
                        "&:disabled": {
                          backgroundColor: "#9ca3af",
                        },
                      }}
                    >
                      {isUpdatingPayment ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Đang xử lý...
                        </div>
                      ) : (
                        "Tôi đã chuyển khoản - Hoàn tất thanh toán"
                      )}
                    </Button>
                  )}

                  {isCountdownActive && (
                    <Button
                      variant="outlined"
                      disabled
                      className="w-full py-3"
                      sx={{
                        color: "#6b7280",
                        borderColor: "#d1d5db",
                        cursor: "not-allowed",
                      }}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Vui lòng đợi {countdown} giây
                    </Button>
                  )}

                  {isPaymentCompleted && (
                    <Button
                      variant="contained"
                      color="success"
                      className="w-full py-3"
                      onClick={() => (window.location.href = `/don-hang`)}
                      sx={{
                        backgroundColor: "#16a34a",
                        "&:hover": {
                          backgroundColor: "#15803d",
                        },
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Xem chi tiết đơn hàng
                    </Button>
                  )}

                  {/* Alternative Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/don-hang"
                      onClick={() => setShowSuccessPopUp(false)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Xem tất cả đơn hàng
                    </Link>
                    <Link
                      href="/ "
                      onClick={() => setShowSuccessPopUp(false)}
                      className="flex-1 bg-white border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPopUp;
