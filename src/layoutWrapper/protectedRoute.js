"use client";

import { isTokenExpired } from "@/utils/authenticate";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const routePermissions = {
  "/admin": ["content-creator", "product-manager", "admin"],
  "/admin/categories": ["product-manager", "admin"],
  "/admin/brands": ["product-manager", "admin"],
  "/admin/subcategories": ["product-manager", "admin"],
  "/admin/filter-attributes": ["product-manager", "admin"],
  "/admin/category-attributes": ["product-manager", "admin"],
  "/admin/products": ["product-manager", "admin"],
  "/admin/add-product": ["product-manager", "admin"],
  "/admin/update-product": ["product-manager", "admin"],
  "/admin/vouchers": ["product-manager", "admin"],
  "/admin/orders": ["product-manager", "admin"],
  "/admin/labels": ["product-manager", "admin"],
  "/admin/news-categories": ["content-creator", "admin"],
  "/admin/news": ["content-creator", "admin"],
  "/admin/add-news": ["content-creator", "admin"],
  "/admin/update-news": ["content-creator", "admin"],
  "/admin/banners": ["content-creator", "admin"],
  "/admin/files": ["content-creator", "product-manager", "admin"],
  "/admin/accounts": ["admin"],
  "/admin/settings": ["admin"],
  "/admin/reviews-and-comments": ["admin", "product-manager"],
};

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (isTokenExpired(refreshToken)) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUserRole(null);
          router.push("/dang-nhap");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const role = user.role || null;
        setUserRole(role);
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing auth data:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUserRole(null);
        setIsLoading(false);
        router.push("/dang-nhap");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading && userRole) {
      const allowedRoles = routePermissions[pathname] || [];
      if (!allowedRoles.includes(userRole)) {
        router.push("/dang-nhap");
      }
    } else if (!isLoading && !userRole) {
      router.push("/dang-nhap");
    }
  }, [userRole, pathname, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return userRole && routePermissions[pathname]?.includes(userRole)
    ? children
    : null;
}
