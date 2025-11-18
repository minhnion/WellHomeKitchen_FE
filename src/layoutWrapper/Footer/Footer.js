import React from "react";
import Link from "next/link";
import { setAnonymousId } from "@/utils/anonymousUtils";

export default function Footer({ config }) {
  setAnonymousId();
  const {
    company_phone,
    primary_location,
    secondary_location,
    technique_phone,
    company_email,
    timeline,
  } = config;

  // Icons as inline SVG components
  const Icons = {
    Home: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
      </svg>
    ),
    Map: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z" />
      </svg>
    ),
    Facebook: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22,12.1c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10c0,5,3.7,9.1,8.4,9.9v-7H7.9v-2.9h2.5V9.9c0-2.5,1.5-3.9,3.8-3.9c1.1,0,2.2,0.2,2.2,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L15.9,15h-2.3v7C18.3,21.2,22,17.1,22,12.1z" />
      </svg>
    ),
    Instagram: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12,6.8c-2.8,0-5.2,2.3-5.2,5.2S9.2,17.2,12,17.2c2.8,0,5.2-2.3,5.2-5.2S14.8,6.8,12,6.8z M12,15.2c-1.8,0-3.2-1.4-3.2-3.2S10.2,8.8,12,8.8s3.2,1.4,3.2,3.2S13.8,15.2,12,15.2z M17.4,6.7c0,0.7-0.6,1.2-1.2,1.2c-0.7,0-1.2-0.6-1.2-1.2c0-0.7,0.6-1.2,1.2-1.2C16.9,5.5,17.4,6,17.4,6.7z M20.9,8c-0.1-1.8-0.5-3.4-1.9-4.8C17.6,1.8,16,1.4,14.2,1.3c-1.9-0.1-7.6-0.1-9.5,0C3,1.4,1.4,1.8,0,3.2C-1.5,4.6-1.9,6.2-2,8c-0.1,1.9-0.1,7.6,0,9.5c0.1,1.8,0.5,3.4,1.9,4.8c1.4,1.4,3,1.8,4.8,1.9c1.9,0.1,7.6,0.1,9.5,0c1.8-0.1,3.4-0.5,4.8-1.9c1.4-1.4,1.8-3,1.9-4.8c0.1-1.9,0.1-7.6,0-9.5H20.9z M18.7,19.5c-0.4,1-1.2,1.8-2.2,2.2c-1.5,0.6-5.1,0.5-6.8,0.5S6.5,22.3,5,21.7c-1-0.4-1.8-1.2-2.2-2.2c-0.6-1.5-0.5-5.1-0.5-6.8s-0.1-5.3,0.5-6.8c0.4-1,1.2-1.8,2.2-2.2c1.5-0.6,5.1-0.5,6.8-0.5s5.3-0.1,6.8,0.5c1,0.4,1.8,1.2,2.2,2.2c0.6,1.5,0.5,5.1,0.5,6.8S19.3,18,18.7,19.5z" />
      </svg>
    ),
    Youtube: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.5,6.2c-0.3-1-1-1.8-2-2C19.9,4,12,4,12,4S4.1,4,2.5,4.2c-1,0.2-1.8,1-2,2C0.2,7.8,0,9.9,0,12c0,2.1,0.2,4.2,0.5,5.8c0.3,1,1,1.8,2,2C4.1,20,12,20,12,20s7.9,0,9.5-0.2c1-0.2,1.8-1,2-2c0.3-1.6,0.5-3.7,0.5-5.8C24,9.9,23.8,7.8,23.5,6.2z M9.5,15.8V8.2l6.4,3.8L9.5,15.8z" />
      </svg>
    ),
    Messenger: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12,2C6.36,2,1.78,6.58,1.78,12.21c0,3.26,1.7,6.17,4.23,8.08V22l4.09-2c0.62,0.11,1.25,0.16,1.89,0.16c5.64,0,10.22-4.58,10.22-10.21S17.64,2,12,2z M12.73,15.1l-2.76-3.11l-5.42,3.11l5.09-5.09l3,3.02L17.79,9L12.73,15.1z" />
      </svg>
    ),
    Zalo: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.49 10.27a.8.8 0 100-1.6.8.8 0 000 1.6zm-3.9-.8a.8.8 0 01.8-.8.8.8 0 110 1.6.8.8 0 01-.8-.8zm7.81 0a.8.8 0 01.8-.8.8.8 0 110 1.6.8.8 0 01-.8-.8zM12 2a10 10 0 100 20 10 10 0 000-20zm4.13 12.3c-.45.26-1.01.45-1.65.58a9.03 9.03 0 01-2.44.18l-.96 1.19a.48.48 0 01-.85-.12L9.7 14.3l-.33-.03c-.58-.11-1.07-.3-1.45-.55C6.57 12.95 6 12.15 6 11.02c0-1.22.67-2.37 1.95-3.17 1.11-.7 2.59-1.08 4.15-1.08 1.55 0 3 .37 4.1 1.06l.03.01c1.26.8 1.92 1.94 1.92 3.16 0 1.13-.57 1.92-1.92 2.68l-.1.06-.01.01v.55z" />
      </svg>
    ),
    Phone: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
      </svg>
    ),
  };

  const companyInfo = [
    { title: "Giới thiệu về Kitchen Care", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Quy định chung", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Kinh nghiệm hay", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Khuyến mại", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Thư mời hợp tác đại lý", linkTo: "/gioi-thieu-kitchen-care" },
  ];

  const policyInfo = [
    { title: "Giao hàng và lắp đặt", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Bảo hành và đổi sản phẩm", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Quyền lợi sau mua hàng", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Chính sách thanh toán", linkTo: "/gioi-thieu-kitchen-care" },
    { title: "Đăng kí gia hạn bảo hành", linkTo: "/gioi-thieu-kitchen-care" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-neutral">
      {/* Wave separator */}
      <div className="text-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="currentColor"
        >
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,75C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-12">
        {/* Logo and Brand section */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-3xl font-bold text-blue-600 tracking-tight mb-3">
            Kitchen Care
          </div>
          <p className="text-center text-gray-600 max-w-md">
            Chuyên cung cấp các giải pháp nhà bếp hiện đại, tiện nghi và đẳng
            cấp
          </p>

          {/* Social media icons - CSS hover only */}
          {/* <div className="flex space-x-4 mt-4">
            <Link
              href="#"
              className="text-blue-600 transform transition-transform duration-300 hover:scale-110"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                <Icons.Facebook />
              </div>
            </Link>
            <Link
              href="#"
              className="text-pink-600 transform transition-transform duration-300 hover:scale-110"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                <Icons.Instagram />
              </div>
            </Link>
            <Link
              href="#"
              className="text-red-600 transform transition-transform duration-300 hover:scale-110"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                <Icons.Youtube />
              </div>
            </Link>
          </div> */}
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hanoi locations */}
          <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-300 hover:-translate-y-1">
            <h3 className="font-bold text-lg mb-4 text-blue-700 border-b border-gray-200 pb-2">
              HÀ NỘI
            </h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <div className="mr-3 text-blue-600 mt-1">
                  <Icons.Home />
                </div>
                <div>
                  <p className="text-gray-700">{primary_location}</p>
                  <Link
                    target="_blank"
                    href="https://maps.app.goo.gl/vAokL1dkZuNYLcfH7"
                    className="text-blue-600 text-sm mt-1 flex items-center transition-colors duration-300 hover:text-blue-800 group"
                  >
                    Bản đồ đường đi
                    <span className="text-red-500 ml-1 transform transition-transform duration-300 group-hover:ml-2">
                      <Icons.Map />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mr-3 text-blue-600 mt-1">
                  <Icons.Home />
                </div>
                <div>
                  <p className="text-gray-700">{secondary_location}</p>
                  <Link
                    target="_blank"
                    href="https://maps.app.goo.gl/K6vzHtnMR4uCyhFo7"
                    className="text-blue-600 text-sm mt-1 flex items-center transition-colors duration-300 hover:text-blue-800 group"
                  >
                    Bản đồ đường đi
                    <span className="text-red-500 ml-1 transform transition-transform duration-300 group-hover:ml-2">
                      <Icons.Map />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Customer care */}
          <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-300 hover:-translate-y-1">
            <h3 className="font-bold text-lg mb-4 text-blue-700 border-b border-gray-200 pb-2">
              CHĂM SÓC KHÁCH HÀNG
            </h3>
            <div className="mb-3">
              <p>
                <span className="text-gray-700">Bán hàng: </span>
                <span className="text-red-500 font-bold">{company_phone}</span>
                <span className="text-gray-600 text-sm">{" (" + timeline + ")"}</span>
              </p>
            </div>
            <div className="mb-3">
              <p>
                <span className="text-gray-700">Kỹ thuật: </span>
                <span className="text-red-500 font-bold">
                  {technique_phone}
                </span>
                <span className="text-gray-600 text-sm">{" (" + timeline + ")"}</span>
              </p>
            </div>
            <div className="mb-3">
              <p>
                <span className="text-gray-700">Khiếu nại: </span>
                <span className="text-red-500">{company_email}</span>
              </p>
            </div>
          </div>

          {/* Company info */}
          <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-300 hover:-translate-y-1">
            <h3 className="font-bold text-lg mb-4 text-blue-700 border-b border-gray-200 pb-2">
              THÔNG TIN CÔNG TY
            </h3>
            <ul className="space-y-2">
              {companyInfo.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.linkTo}
                    className="flex items-center group transition-colors duration-300 hover:text-blue-600"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-2">
                      ›
                    </span>
                    <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-300 hover:-translate-y-1">
            <h3 className="font-bold text-lg mb-4 text-blue-700 border-b border-gray-200 pb-2">
              CHÍNH SÁCH
            </h3>
            <ul className="space-y-2">
              {policyInfo.map((policy) => (
                <li key={policy.title}>
                  <Link
                    href={policy.linkTo}
                    className="flex items-center group transition-colors duration-300 hover:text-blue-600"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-2">
                      ›
                    </span>
                    <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">
                      {policy.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Quick contact buttons */}
            {/* <div className="flex justify-center space-x-4 mt-6">
              <Link
                href="#"
                title="Messenger"
                className="transform transition-transform duration-300 hover:scale-110 text-blue-600"
              >
                <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
                  <Icons.Messenger />
                </div>
              </Link>
              <Link
                href="#"
                title="Zalo"
                className="transform transition-transform duration-300 hover:scale-110 text-blue-500"
              >
                <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
                  <Icons.Zalo />
                </div>
              </Link>
              <Link
                href="#"
                className="transform transition-transform duration-300 hover:scale-110 text-green-600"
                title="Phone"
              >
                <div className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center">
                  <Icons.Phone />
                </div>
              </Link>
            </div> */}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-600">
          <p>
            © {new Date().getFullYear()} Kitchen Care. Tất cả các quyền được bảo
            lưu.
          </p>
          <p className="text-sm mt-1">
            Thiết kế và phát triển bởi Kitchen Care Team
          </p>
        </div>
      </div>
    </footer>
  );
}
