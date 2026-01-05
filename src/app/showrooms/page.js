import { getConfigByKey } from "@/apiServices/config";
import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import ShowroomsClient from "./component/ShowroomsClient";

export async function generateMetadata() {
  return {
    title: "Hệ Thống Showroom - Bepanphu",
    description:
      "Khám phá hệ thống showroom Bepanphu tại Hà Nội. Địa chỉ, bản đồ, số điện thoại và thời gian hoạt động cập nhật nhất.",
    openGraph: {
      title: "Hệ Thống Showroom - Bepanphu",
      description:
        "Đến thăm showroom Bepanphu để trải nghiệm sản phẩm và nhận tư vấn từ chuyên gia. Xem bản đồ và thông tin chi tiết tại đây.",
    },
  };
}

export default async function ShowroomsPage() {
  const showroomsBanner = await getConfigByKey("showrooms-banner");
  const workingHours = await getConfigByKey("timeline");
  const companyPhone = await getConfigByKey("company_phone");

  const currentLocations = [
    {
      _id: 1,
      address: "106 Nguyễn Khánh Toàn - Cầu Giấy - Hà Nội",
      linkTo: "https://maps.app.goo.gl/vAokL1dkZuNYLcfH7",
      iframeUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.878649545459!2d105.8015094!3d21.037540999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3f19c86327%3A0x592faf5ce16c04eb!2zS2l0Y2hlbmNhcmUgLSBTacOqdSBUaOG7iyBOaMOgIELhur9wIENow6J1IMOCdQ!5e0!3m2!1svi!2s!4v1747316732946!5m2!1svi!2s",
      openingHours: workingHours,
      phone: companyPhone,
    },
    {
      _id: 2,
      address: "94 Đường Láng - Thịnh Quang - Đống Đa - Hà Nội",
      linkTo: "https://maps.app.goo.gl/K6vzHtnMR4uCyhFo7",
      iframeUrl:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1862.3510463156247!2d105.8176876!3d21.0045756!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac84a17d8a99%3A0x4a5828a15fb4fb7e!2zOTQgxJAuIEzDoW5nLCBUaOG7i25oIFF1YW5nLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lpIDEwMDAwMA!5e0!3m2!1svi!2s!4v1747316924532!5m2!1svi!2s",
      openingHours: workingHours,
      phone: companyPhone,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary px-4 py-8 md:px-10">
      {showroomsBanner && (
        <div className="w-full">
          <Image
            src={`${API_BASE_URL}${showroomsBanner}`}
            alt="Showrooms Banner"
            width={1200}
            height={300}
            className="w-full h-auto rounded-t-lg"
          />
        </div>
      )}

      {/* ShowroomsClient component */}
      <ShowroomsClient locations={currentLocations} />
    </div>
  );
}
