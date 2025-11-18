"use client";
import React from "react";

const Pricing = ({ formFields, onChangeFormFields }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = value === "" ? "" : parseFloat(value);
    if (parsedValue < 0 || isNaN(parsedValue)) {
      return;
    }
    onChangeFormFields({ ...formFields, [name]: value });
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Thông tin giá
      </h3>
      <div className="space-y-4">
        <div>
          <input
            type="number"
            name="price"
            value={formFields.price || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
            placeholder="Giá bán (*)"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <input
            type="number"
            name="discountPercent"
            value={formFields.discountPercent}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
            placeholder="Giảm giá (%)"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
