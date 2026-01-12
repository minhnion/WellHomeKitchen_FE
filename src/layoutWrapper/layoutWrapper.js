"use client";
import Footer from "@/layoutWrapper/Footer/Footer";
import Header from "@/layoutWrapper/Header/Header";
import { usePathname } from "next/navigation";
import { FaFacebookMessenger, FaPhone } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function LayoutWrapper({ children, categories, config }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    return <>{children}</>;
  }
  return (
    <>
      <Header phoneNumber={config.company_phone} categories={categories} />
      <div className="mx-auto max-w-[1515px] container">{children}</div>
      <div className="fixed bottom-2 md:bottom-20 md:right-4 flex md:flex-col gap-4 justify-center md:justify-start z-50 w-full md:w-auto">
        <a
          href={`${config.facebook_link}`}
          target="_blank"
          className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition"
          aria-label="Chat on Messenger"
        >
          <FaFacebookMessenger size={20} />
        </a>

        <a
          href={`${config.zalo_link}`}
          target="_blank"
          className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition"
          aria-label="Chat on Zalo"
        >
          <SiZalo size={20} />
        </a>
        <a
          href={`tel:${config.company_phone}`}
          className="bg-green-500 p-3 rounded-full text-white hover:bg-green-600 transition"
          aria-label="Call us"
        >
          <FaPhone size={20} />
        </a>
      </div>
      <Footer config={config} />
    </>
  );
}
