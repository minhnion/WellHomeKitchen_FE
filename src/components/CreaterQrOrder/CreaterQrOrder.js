"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Download, Copy, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getBankConfig } from "@/apiServices/config";

const CreateQrOrder = ({ amount, orderInfo, orderId, onSuccess, onError }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bankConfig, setBankConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Memoize default config to prevent re-creation on every render
  const defaultBankConfig = useMemo(
    () => ({
      accountNo: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NO || "113366668888",
      accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "Kitchen Care",
      acqId: process.env.NEXT_PUBLIC_BANK_ACQ_ID || "970415",
      clientId: process.env.NEXT_PUBLIC_VIETQR_CLIENT_ID,
      apiKey: process.env.NEXT_PUBLIC_VIETQR_API_KEY,
    }),
    []
  );

  // Memoize the QR payload to prevent unnecessary re-calculations
  const qrPayload = useMemo(() => {
    if (!bankConfig || !amount || !orderInfo) return null;

    return {
      accountNo: bankConfig.accountNo,
      acqId: bankConfig.acqId,
      accountName: bankConfig.accountName,
      addInfo: orderInfo.trim(),
      amount: amount.toString(),
      template: "compact",
    };
  }, [bankConfig, amount, orderInfo]);

  // Fetch bank config only once
  const fetchBankConfig = useCallback(async () => {
    if (configLoaded) return;

    try {
      setLoading(true);
      const config = await getBankConfig();

      const accountNo =
        config?.value.split("-")[0] || defaultBankConfig.accountNo;
      const accountName =
        config?.value.split("-")[1] || defaultBankConfig.accountName;

      const newBankConfig = {
        accountNo: accountNo || defaultBankConfig.accountNo,
        accountName: accountName || defaultBankConfig.accountName,
        acqId: config?.other || defaultBankConfig.acqId,
        clientId: defaultBankConfig.clientId,
        apiKey: defaultBankConfig.apiKey,
      };

      setBankConfig(newBankConfig);
      setConfigLoaded(true);
    } catch (error) {
      console.error("Error fetching bank config:", error);
      // Fallback to default config
      setBankConfig(defaultBankConfig);
      setConfigLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [configLoaded, defaultBankConfig]);

  // Generate QR Code function
  const generateQrCode = useCallback(async () => {
    if (!qrPayload) {
      setError("Thiếu thông tin cần thiết để tạo mã QR");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.vietqr.io/v2/generate", {
        method: "POST",
        headers: {
          "x-client-id": bankConfig.clientId,
          "x-api-key": bankConfig.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qrPayload),
      });

      const result = await response.json();

      if (response.ok && result.code === "00") {
        const qrResult = {
          qrCode: result.data.qrDataURL,
          qrString: result.data.qrCode,
          ...qrPayload,
        };

        setQrData(qrResult);

        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(result.desc || "Không thể tạo mã QR");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo mã QR";
      setError(errorMessage);

      if (onError) {
        onError(error);
      }

      toast.error("Tạo mã QR thất bại!");
    } finally {
      setLoading(false);
    }
  }, [qrPayload, bankConfig, onSuccess, onError]);

  // Load config on mount
  useEffect(() => {
    if (amount && orderInfo && !configLoaded) {
      fetchBankConfig();
    }
  }, [amount, orderInfo, configLoaded, fetchBankConfig]);

  // Generate QR when config is loaded and payload is ready
  useEffect(() => {
    if (configLoaded && qrPayload && !qrData && !loading) {
      generateQrCode();
    }
  }, [configLoaded, qrPayload, qrData, loading, generateQrCode]);

  // Memoized functions to prevent re-creation
  const copyToClipboard = useCallback(async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${type}!`);
    } catch (error) {
      toast.error("Không thể sao chép!");
    }
  }, []);

  const downloadQrCode = useCallback(() => {
    if (!qrData?.qrCode) return;

    const link = document.createElement("a");
    link.href = qrData.qrCode;
    link.download = `QR_Order_${orderId || Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Đã tải xuống mã QR!");
  }, [qrData, orderId]);

  const retryGenerateQr = useCallback(() => {
    setError(null);
    setQrData(null);
    generateQrCode();
  }, [generateQrCode]);

  // Memoize formatted currency
  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }, [amount]);

  // Loading state
  if (!configLoaded || loading) {
    return (
      <div className="bg-white p-6 mx-auto">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-gray-600 font-medium">
            {!configLoaded ? "Đang tải cấu hình..." : "Đang tạo mã QR..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Thanh toán chuyển khoản
        </h2>
        <p className="text-gray-600 text-sm">
          Quét mã QR hoặc chuyển khoản thủ công
        </p>
      </div>

      {/* Order Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-bold text-blue-600">{formattedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nội dung:</span>
            <span className="font-medium text-right max-w-[200px] truncate">
              {orderInfo}
            </span>
          </div>
          {orderId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn:</span>
              <span className="font-mono text-xs">{orderId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
          <button
            onClick={retryGenerateQr}
            className="text-red-600 hover:text-red-700 text-sm font-medium border-b border-red-200 hover:border-red-300 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      <div className="flex justify-around mb-6 max-md:flex-col gap-6">
        {/* QR Code Display */}
        {qrData && !error && (
          <div className="text-center">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 inline-block">
              <img
                src={qrData.qrCode}
                alt="QR Code"
                className="w-65 h-65 mx-auto max-md:w-48 max-md:h-48"
                loading="lazy"
              />
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={downloadQrCode}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải xuống
              </button>

              <button
                onClick={() => copyToClipboard(qrData.qrString, "mã QR")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
              >
                <Copy className="w-4 h-4 mr-2" />
                Sao chép
              </button>
            </div>
          </div>
        )}

        {/* Manual Transfer Info */}
        {bankConfig && (
          <div className="flex-1 max-w-md">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">
              {qrData ? "Hoặc chuyển khoản thủ công" : "Thông tin chuyển khoản"}
            </h3>

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      Số tài khoản
                    </div>
                    <div className="font-mono font-bold text-sm truncate">
                      {bankConfig.accountNo}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(bankConfig.accountNo, "số tài khoản")
                    }
                    className="text-blue-600 hover:text-blue-700 p-1 ml-2 flex-shrink-0"
                    title="Sao chép số tài khoản"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      Chủ tài khoản
                    </div>
                    <div className="font-medium text-sm truncate">
                      {bankConfig.accountName}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        bankConfig.accountName,
                        "tên chủ tài khoản"
                      )
                    }
                    className="text-blue-600 hover:text-blue-700 p-1 ml-2 flex-shrink-0"
                    title="Sao chép tên chủ tài khoản"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      Nội dung chuyển khoản
                    </div>
                    <div className="font-medium text-sm break-words">
                      {orderInfo.trim()}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(orderInfo.trim(), "nội dung")
                    }
                    className="text-blue-600 hover:text-blue-700 p-1 ml-2 flex-shrink-0"
                    title="Sao chép nội dung chuyển khoản"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-blue-600 mb-1">Số tiền</div>
                    <div className="font-bold text-blue-700 text-lg">
                      {formattedAmount}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(amount.toString(), "số tiền")
                    }
                    className="text-blue-600 hover:text-blue-700 p-1 ml-2 flex-shrink-0"
                    title="Sao chép số tiền"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Note - Compact but Clear */}
      <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-yellow-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-12 h-12 bg-yellow-200 rounded-full opacity-20"></div>

        <div className="relative">
          <div className="flex items-center mb-3">
            <div className="bg-yellow-400 rounded-full p-1.5 mr-3">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-base font-bold text-yellow-900">
              Lưu ý quan trọng
            </h4>
          </div>

          <div className="space-y-3">
            <div className="flex items-start text-sm text-yellow-800">
              <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <p className="leading-relaxed">
                <span className="font-semibold">
                  Ghi đúng nội dung chuyển khoản
                </span>{" "}
                để chúng tôi có thể xác nhận thanh toán nhanh chóng và chính
                xác.
              </p>
            </div>

            <div className="flex items-start text-sm text-yellow-800">
              <span className="inline-block w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <p className="leading-relaxed">
                <span className="font-semibold">
                  Chụp ảnh chứng từ chuyển khoản
                </span>{" "}
                và lưu lại để đối chiếu nếu cần thiết.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQrOrder;
