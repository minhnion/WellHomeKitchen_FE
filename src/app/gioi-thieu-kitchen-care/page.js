import { getConfigByKey } from "@/apiServices/config";
import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";

export async function generateMetadata() {
  return {
    title: "Giới Thiệu Về Bepanphu | Thông Tin Công Ty",
    description:
      "Tìm hiểu về Bepanphu – đơn vị cung cấp giải pháp nhà bếp thông minh, chất lượng và uy tín hàng đầu. Xem thông tin công ty, sứ mệnh và tầm nhìn.",
    openGraph: {
      title: "Giới Thiệu Về Bepanphu | Thông Tin Công Ty",
      description:
        "Bepanphu – Giải pháp bếp thông minh cho gia đình hiện đại. Khám phá sứ mệnh và giá trị cốt lõi của chúng tôi.",
    },
  };
}

export default async function IntroductionPage() {
  const introductionImage = await getConfigByKey("introduction");

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-8 md:px-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl transition-all duration-300 hover:shadow-xl">
        <div className="text-center py-6 px-4 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Giới thiệu
          </h2>
          <p className="text-gray-600 mt-2">
            Thông tin chi tiết về công ty chúng tôi
          </p>
        </div>

        <div className="relative w-full">
          <div className="aspect-[800/2260] relative w-full">
            <Image
              src={new URL(introductionImage, API_BASE_URL).href}
              alt="Giới thiệu về công ty"
              fill
              className="object-contain"
              priority
              quality={95}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
