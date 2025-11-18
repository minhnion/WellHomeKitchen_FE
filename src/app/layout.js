export const dynamic = 'force-dynamic';

import "./globals.css";
import { getConfigByKey } from "@/apiServices/config";
import { getAllCategories } from "@/apiServices/categories";
import LayoutWrapper from "../layoutWrapper/layoutWrapper";
import { ToastContainer } from "react-toastify";
import ModalConfig from "@/components/ModalConfig/ModalConfig";

export const metadata = {
  title: "Kitchen Care - Thiết bị nhà bếp cao cấp",
  description:
    "Cung cấp các sản phẩm thiết bị nhà bếp chất lượng cao với giá cả hợp lý",
  keywords: "thiết bị nhà bếp, bếp từ, lò nướng, máy rửa bát, tủ lạnh",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  const categories = await getAllCategories();
  const keys = [
    "company_phone",
    "primary_location",
    "secondary_location",
    "technique_phone",
    "company_email",
    "timeline",
    "facebook_link",
    "zalo_link",
  ];

  const values = await Promise.all(keys.map((k) => getConfigByKey(k)));
  const config = keys.reduce((obj, key, idx) => {
    obj[key] = values[idx];
    return obj;
  }, {});

  return (
    <html lang="en">
      <body className="bg-secondary">
        <LayoutWrapper categories={categories} config={config}>
          <ToastContainer position="top-right" autoClose={3000} />
          <ModalConfig />
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
