"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const COLORS = [
  "#5368F0",
  "#FDB528",
  "#A155B9",
  "#F95C5C",
  "#3E784E",
  "#FF6D53",
];

const renderCustomLegend = (props) => {
  const { payload } = props;
  if (!payload) return null;

  return (
    <div className="w-full flex justify-center mt-4">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 list-none p-0 m-0">
        {payload.map((entry) => (
          <li key={entry.value} className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RatioChart = ({ data, title, link }) => {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.ratio,
  }));

  return (
    <div className="rounded-lg shadow-md w-full bg-white p-2">
      <div className="flex items-center justify-between pl-4 pr-4 pt-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        {link && (
          <Link href={link} className="text-blue-600 hover:text-blue-800">
            <FaArrowRight size={20} />
          </Link>
        )}
      </div>
      <div className="border-b border-gray-200 mb-6"></div>
      <div className="flex justify-center">
        <PieChart width={300} height={280}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => value.toLocaleString()}
            contentStyle={{
              borderRadius: "4px",
              border: "none",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            content={renderCustomLegend}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ width: "100%" }}
          />
        </PieChart>
      </div>
    </div>
  );
};

export default RatioChart;