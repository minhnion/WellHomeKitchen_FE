import React from "react";

const PaymentOption = ({ paymentMethod, setPaymentMethod }) => {
  const options = [
    {
      id: "cod",
      label: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán bằng tiền mặt khi nhận được đơn hàng",
    },
    {
      id: "bank_transfer",
      label: "Chuyển khoản ngân hàng",
      description:
        "Thực hiện thanh toán vào tài khoản ngân hàng của chúng tôi. Đơn hàng sẽ được xác nhận sau khi tiền đã được chuyển.",
    },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Phương thức thanh toán
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={`border ${
              paymentMethod === option.id
                ? "border-primary bg-blue-50"
                : "border-gray-200"
            } rounded-lg p-4 cursor-pointer`}
            onClick={() => setPaymentMethod(option.id)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id={option.id}
                name="payment"
                checked={paymentMethod === option.id}
                onChange={() => setPaymentMethod(option.id)}
                className="mt-1"
              />
              <label
                htmlFor={option.id}
                className="ml-3 cursor-pointer flex-grow"
              >
                <span className="block font-medium text-gray-800">
                  {option.label}
                </span>
                <span className="block text-sm text-gray-500 mt-1">
                  {option.description}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOption;
