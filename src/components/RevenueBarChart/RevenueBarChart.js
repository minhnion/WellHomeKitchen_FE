"use client";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-sm">
        <p className="font-medium">{monthNames[data.month - 1]}</p>
        <p className="text-blue-600">
          Doanh thu:{" "}
          {data.total.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
      </div>
    );
  }
  return null;
};

const RevenueBarChart = ({ data }) => {
  const chartWidth = Math.max(800, data.length * 80);

  return (
    <div className="rounded-lg shadow-md bg-white p-2">
      <h2 className="text-lg font-semibold mb-2 pl-4 pt-4">
        Doanh thu theo tháng
      </h2>
      <div className="border-b border-gray-200 mb-6"></div>
      <div className="overflow-x-auto overflow-y-hidden">
        <div
          style={{
            width: chartWidth,
            height: "320px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={25} barGap={2}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                horizontal
                stroke="#E0E0E0"
              />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => monthNames[month - 1]}
                tick={{ fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "#E0E0E0" }}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) =>
                  value.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                }
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar dataKey="total" name="Doanh thu">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.total > 0 ? "#3E784E" : "#FF6D53"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueBarChart;
