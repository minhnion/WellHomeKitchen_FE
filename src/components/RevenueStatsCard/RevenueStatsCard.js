"use client";
import React from "react";

const RevenueStatsCard = ({ data }) => {
  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="rounded-lg shadow-md bg-white p-2">
      <h2 className="text-lg font-semibold mb-2 pl-4 pt-4">
        Thống kê doanh thu
      </h2>
      <div className="border-b border-gray-200 mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-600">Tổng doanh thu</h3>
          <p className="text-xl font-semibold text-blue-600">
            {formatCurrency(data.totalRevenue || 0)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-600">
            Doanh thu tháng này
          </h3>
          <p className="text-xl font-semibold text-blue-600">
            {formatCurrency(data.revenueThisMonth || 0)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-600">
            Doanh thu quý này
          </h3>
          <p className="text-xl font-semibold text-blue-600">
            {formatCurrency(data.revenueThisQuarter || 0)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-600">
            Doanh thu năm này
          </h3>
          <p className="text-xl font-semibold text-blue-600">
            {formatCurrency(data.revenueThisYear || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueStatsCard;
