import Image from "next/image";

const SellingPoint = () => {
  const points = [
    {
      icon: "/images/mien-phi-van-chuyen-lap-dat-icon.png",
      text: "Miễn phí vận chuyển, lắp đặt",
    },
    {
      icon: "/images/van-chuyen-hoa-toc-icon.png",
      text: "Vận chuyển hỏa tốc 4h",
    },
    {
      icon: "/images/bao-hanh-icon.png",
      text: "Bảo hành từ 2 - 5 năm",
    },
    {
      icon: "/images/1-doi-1-icon.png",
      text:
        "1 đổi 1 trong 30 ngày (nếu có lỗi kỹ thuật phát sinh từ nhà sản xuất)",
    },
  ];

  return (
    <div className=" p-4 bg-white  shadow-sm">
      <div className="text-blue-800 mb-2 font-bold">CHÍNH SÁCH</div>
      <div className="flex flex-col gap-4">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <Image
              src={point.icon}
              alt={point.text}
              width={36}
              height={36}
              className="flex-shrink-0"
            />
            <p className="text-sm font-medium text-gray-700 leading-snug">
              {point.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellingPoint;
