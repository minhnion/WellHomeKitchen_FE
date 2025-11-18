import { CheckCircle } from "lucide-react";

const VoucherSection = ({
  voucher,
  setVoucher,
  voucherApplied,
  voucherDiscount,
  applyVoucher,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Mã giảm giá</h2>
      <div className="flex">
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={applyVoucher}
          className="bg-primary text-white px-6 py-2 rounded-r-md font-medium hover:bg-blue-700"
        >
          Áp dụng
        </button>
      </div>
      {voucherApplied && (
        <div className="flex items-center mt-3 text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">
            Đã áp dụng mã giảm giá: -{voucherDiscount.toLocaleString()}₫
          </span>
        </div>
      )}
    </div>
  );
};

export default VoucherSection;
