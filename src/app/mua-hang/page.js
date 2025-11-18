"use client";
import { use, useEffect, useState } from "react";
import { getProductsById } from "@/apiServices/products";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  ChevronRight,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "@/apiServices/constants";
import provincesVN from "./provincesVn";
import { createOrder, getOrderCode } from "@/apiServices/order";
import { setAnonymousId } from "@/utils/anonymousUtils";
import SuccessPopUp from "./SuccessPopUp";
import PaymentOption from "./PaymentOption";
import VoucherSection from "./VoucherSection";
import { validateVoucher } from "@/apiServices/voucher";
export default function Page() {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setItemId(searchParams.get("ids") || "");
    setQuantity(searchParams.get("quantitys") || "");
  }, []);

  const [itemIds, setItemIds] = useState([]);
  const [itemQuantitys, setItemQuantitys] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voucher, setVoucher] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [anonymousId, setAnonyId] = useState("");
  const [userId, setUserId] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [showSuccessPopUp, setShowSuccessPopUp] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  useEffect(() => {
    const fetchInitialData = async () => {
      const storedAnonymousId = localStorage.getItem("anonymousId");
      if (storedAnonymousId) {
        setAnonyId(storedAnonymousId);
      } else {
        setAnonyId(setAnonymousId());
      }
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setUserId(parsedUserInfo.id);
      }
      try {
        const code = await getOrderCode();
        setOrderCode(code);
      } catch (error) {
        console.error("Error fetching order code:", error);
      }
    };
    fetchInitialData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Parse URL params
  useEffect(() => {
    if (itemId) {
      setItemIds(itemId.split(","));
    }
    if (quantity) {
      setItemQuantitys(quantity.split(",").map(Number));
    }
  }, [itemId, quantity]);

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productPromises = itemIds.map((id) => getProductsById(id));
        const productResponses = await Promise.all(productPromises);
        const validProducts = productResponses;
        if (validProducts.length === 0) {
          setIsLoading(false);
          return;
        }
        setProducts(validProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (itemIds.length > 0) {
      fetchProducts();
    }
  }, [itemIds]);

  // Calculate order totals
  // Calculate order totals
  const subtotal = products.reduce((total, product, index) => {
    // Skip invalid products
    if (!product || typeof product.price !== "number") {
      return total;
    }

    const price =
      product.price - (product.price * (product.discountPercent || 0)) / 100;
    return total + price * (itemQuantitys[index] || 0);
  }, 0);

  const shipping = 0;
  const discount = voucherApplied ? voucherDiscount : 0;
  const total = subtotal + shipping - discount;

  // Handle quantity changes
  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const newQuantities = [...itemQuantitys];
    newQuantities[index] = newQty;
    setItemQuantitys(newQuantities);

    // Update URL params
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("quantitys", newQuantities.join(","));
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Handle product removal
  const removeProduct = (index) => {
    const newIds = [...itemIds];
    const newQtys = [...itemQuantitys];
    const newProducts = [...products];

    newIds.splice(index, 1);
    newQtys.splice(index, 1);
    newProducts.splice(index, 1);

    setItemIds(newIds);
    setItemQuantitys(newQtys);
    setProducts(newProducts);

    // Update URL params
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("ids", newIds.join(","));
    searchParams.set("quantitys", newQtys.join(","));
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  const applyVoucher = async () => {
    const code = voucher;
    const cartTotal = total;
    const productIds = itemIds;
    try {
      const response = await validateVoucher(code, cartTotal, productIds);
      if (response) {
        setVoucherApplied(true);
        setVoucherDiscount(response.discountAmount);
      } else {
        setVoucherApplied(false);
        setVoucherDiscount(0);
        alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    const code = await getOrderCode();
    setOrderCode(code);
    const orderData = {
      userId: userId || null,
      anonymousId: anonymousId,
      products: itemIds.map((id, index) => ({
        productId: id,
        quantity: itemQuantitys[index],
      })),
      userName: data.fullName,
      userEmail: data.email,
      userPhone: data.phone,
      district: data.province,
      address: data.address,
      note: data.note,
      paymentMethod: paymentMethod,
      orderCode: code,
    };
    console.log("Order Data:", orderData);
    try {
      const response = await createOrder(orderData);
      if (response.success) {
        // Save the current total before clearing state
        setFinalTotal(total);
        
        // Reset form data
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete("ids");
        searchParams.delete("quantitys");
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);

        // Clear state data
        setItemIds([]);
        setItemQuantitys([]);
        setProducts([]);
        setVoucher("");
        setVoucherApplied(false);
        setVoucherDiscount(0);
        setShowSuccessPopUp(true);
        setOrderId(response.data._id);
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(
        `Đặt hàng không thành công. Vui lòng thử lại sau. ${error.response.data.error}`
      );
      console.error("Error creating order:", error);
    }
  };

  if (
    !itemId ||
    !quantity ||
    itemId.length === 0 ||
    quantity.length === 0 ||
    itemIds.length !== itemQuantitys.length
  ) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn chưa chọn sản phẩm nào để mua hàng.
          </p>
          <Link
            href="/san-pham"
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 inline-flex items-center"
          >
            Tiếp tục mua sắm
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - Products and Customer Form */}
        <div className="flex-grow">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              Giỏ hàng của bạn ({products.length} sản phẩm)
            </h2>

            <div className="divide-y divide-gray-100">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="py-6 flex flex-col sm:flex-row items-start gap-4"
                >
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.mainImage ? (
                      <Image
                        src={new URL(product.mainImage, API_BASE_URL).href}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100px, 96px"
                      />
                    ) : (
                      <Package className="w-full h-full p-4 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <Link
                        href={`/san-pham/${product.slug}`}
                        className="font-medium text-gray-800 hover:text-primary line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => removeProduct(index)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Xóa sản phẩm"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {product.attributes && product.attributes.length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {product.attributes.map((attr) => (
                          <span key={attr._id} className="mr-2">
                            {attr.name}: {attr.value}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(index, itemQuantitys[index] - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <div className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                          {itemQuantitys[index]}
                        </div>
                        <button
                          onClick={() =>
                            updateQuantity(index, itemQuantitys[index] + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        {product.discountPercent > 0 && (
                          <span className="text-sm text-gray-400 line-through mr-2">
                            {product.price.toLocaleString()}₫
                          </span>
                        )}
                        <span className="font-semibold text-gray-800">
                          {(
                            product.price -
                            (product.price * (product.discountPercent || 0)) / 100
                          ).toLocaleString()}
                          ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voucher Section */}
          <VoucherSection
            voucher={voucher}
            setVoucher={setVoucher}
            voucherApplied={voucherApplied}
            voucherDiscount={voucherDiscount}
            applyVoucher={applyVoucher}
          />

          {/* Customer Info Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Thông tin đặt hàng
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullName", {
                      required: "Vui lòng nhập họ tên",
                    })}
                    className={`w-full px-4 py-2 border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                    className={`w-full px-4 py-2 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    })}
                    className={`w-full px-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tỉnh/Thành phố
                  </label>
                  <select
                    id="province"
                    {...register("province", {
                      required: "Vui lòng chọn tỉnh/thành phố",
                    })}
                    className={`w-full px-4 py-2 border ${
                      errors.province ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provincesVN.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.province.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ chi tiết
                </label>
                <input
                  id="address"
                  type="text"
                  {...register("address", {
                    required: "Vui lòng nhập địa chỉ",
                  })}
                  className={`w-full px-4 py-2 border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  id="note"
                  {...register("note")}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Yêu cầu đặc biệt về sản phẩm, giao hàng..."
                ></textarea>
              </div>

              {/* Payment Options */}
              <PaymentOption
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </form>
          </div>
        </div>

        {/* Right column - Order Summary */}
        <div className="lg:w-80 xl:w-96">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({products.length} sản phẩm)</span>
                <span>{subtotal.toLocaleString()}₫</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                {shipping > 0 ? (
                  <span>{shipping.toLocaleString()}₫</span>
                ) : (
                  <span className="text-green-600">Miễn phí</span>
                )}
              </div>

              {voucherApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{voucherDiscount.toLocaleString()}₫</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 mt-3"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">{total.toLocaleString()}₫</span>
              </div>
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
              type="submit"
            >
              Đặt hàng ngay
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="ml-2 text-sm text-gray-600">
                  Giao hàng miễn phí cho đơn hàng từ 500.000₫
                </span>
              </div>

              <div className="flex items-start">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="ml-2 text-sm text-gray-600">
                  Cam kết chất lượng, hoàn tiền nếu sản phẩm không đúng mô tả
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSuccessPopUp && (
        <SuccessPopUp
          orderCode={orderCode}
          total={finalTotal}
          orderId={orderId}
          paymentMethod={paymentMethod}
          anonymousId={anonymousId}
          setShowSuccessPopUp={setShowSuccessPopUp}
        />
      )}
    </div>
  );
}
