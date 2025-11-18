"use client";

import React, { useState, useEffect } from "react";
import RatioChart from "@/components/RatioChart/RatioChart";
import RevenueBarChart from "@/components/RevenueBarChart/RevenueBarChart";
import RevenueStatsCard from "@/components/RevenueStatsCard/RevenueStatsCard";
import { refreshToken } from "@/apiServices/auth";
import { getProductOverviewStats } from "@/apiServices/products";
import { getPostOverviewStats } from "@/apiServices/posts";
import { getOrderOverviewStats, getRevenueOverviewStats } from "@/apiServices/order";

export default function AdminDashboardPage() {
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    specialProducts: 0,
    discountedProducts: 0,
    totalQuantitySold: 0,
  });
  const [postStats, setPostStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    revenueThisMonth: 0,
    revenueThisQuarter: 0,
    revenueThisYear: 0,
    revenueByMonth: [],
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await refreshToken();
        const [productData, postData, orderData, revenueData] = await Promise.all([
          getProductOverviewStats(accessToken),
          getPostOverviewStats(accessToken),
          getOrderOverviewStats(accessToken),
          getRevenueOverviewStats(accessToken),
        ]);
        setProductStats(productData || {
          totalProducts: 0,
          specialProducts: 0,
          discountedProducts: 0,
          totalQuantitySold: 0,
        });
        setPostStats(postData || { totalPosts: 0, publishedPosts: 0, draftPosts: 0 });
        setOrderStats(orderData || {
          totalOrders: 0,
          pendingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
        });
        setRevenueStats(revenueData || {
          totalRevenue: 0,
          revenueThisMonth: 0,
          revenueThisQuarter: 0,
          revenueThisYear: 0,
          revenueByMonth: [],
        });
      } catch (err) {
        console.log("Error:", err);
      } 
    };

    fetchData();
  }, []);


  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-semibold mb-4 ">Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RatioChart
          data={[
            { label: "Sản phẩm đặc biệt", ratio: productStats.specialProducts },
            { label: "Sản phẩm giảm giá", ratio: productStats.discountedProducts },
            { label: "Sản phẩm đã bán", ratio: productStats.totalQuantitySold },
          ]}
          title={`Tổng sản phẩm: ${productStats.totalProducts.toLocaleString()}`}
          link="/admin/products"
        />
        <RatioChart
          data={[
            { label: "Bài viết đã xuất bản", ratio: postStats.publishedPosts },
            { label: "Bài viết phát thảo", ratio: postStats.draftPosts },
          ]}
          title={`Tổng bài viết: ${postStats.totalPosts.toLocaleString()}`}
          link="/admin/news"
        />
        <RatioChart
          data={[
            { label: "Đơn hàng chờ xử lý", ratio: orderStats.pendingOrders },
            { label: "Đơn hàng đang giao", ratio: orderStats.shippedOrders },
            { label: "Đơn hàng đã giao", ratio: orderStats.deliveredOrders },
            { label: "Đơn hàng bị hủy", ratio: orderStats.cancelledOrders },
          ]}
          title={`Tổng đơn hàng: ${orderStats.totalOrders.toLocaleString()}`}
          link="/admin/orders"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="col-span-1 md:col-span-2 order-2 md:order-1">
          <RevenueBarChart data={revenueStats.revenueByMonth} />
        </div>
        <div className="col-span-1 order-1 md:order-2">
          <RevenueStatsCard data={revenueStats} />
        </div>
      </div>
    </div>
  );
}
