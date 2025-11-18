import React from "react";
import {
  FaExchangeAlt,
  FaTag,
  FaTools,
  FaMoneyBillWave,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";

const SellingPoint = () => {
  const points = [
    {
      icon: <FaExchangeAlt className="text-primary w-6 h-6" />,
      text: "Nhận đổi trả trong 30 ngày",
    },
    {
      icon: <FaTag className="text-primary w-6 h-6" />,
      text: "Cam kết giá tốt nhất",
    },
    {
      icon: <FaTools className="text-primary w-6 h-6" />,
      text: "Miễn phí lắp đặt tại Hà Nội",
    },
    {
      icon: <FaMoneyBillWave className="text-primary w-6 h-6" />,
      text: "Thanh toán khi nhận hàng",
    },
    {
      icon: <FaTruck className="text-primary w-6 h-6" />,
      text: "Miễn phí giao hàng toàn quốc",
    },
    {
      icon: <FaShieldAlt className="text-primary w-6 h-6" />,
      text: "Bảo hành vĩnh viễn trọn đời máy",
    },
  ];

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {points.map((point, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-shrink-0">{point.icon}</div>
            <p className="text-sm font-medium">{point.text}</p>
          </div>
        ))}
      </div>
      {/* note */}
      <div className="mt-4 pt-3 border-t border-gray-200"></div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Lưu ý bảo hành:
      </h4>
      <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
        <li>Sản phẩm được bảo hành tại nhà khách hàng</li>
        <li>
          Khi bảo hành, khách hàng phải cung cấp: Phiếu bảo hành (có ghi đầy đủ
          thông tin) và hóa đơn mua hàng.
        </li>
      </ul>
    </div>
  );
};

export default SellingPoint;
