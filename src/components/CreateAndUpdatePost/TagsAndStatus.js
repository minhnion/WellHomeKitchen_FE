"use client";
import React, { useState } from "react";

const TagsAndStatus = ({ formFields, onChangeFormFields }) => {
  const [inputValue, setInputValue] = useState(formFields.tags.join(", "));

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean); // Tách dấu phẩy trong logic
    onChangeFormFields({ ...formFields, tags });
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    onChangeFormFields({ ...formFields, [name]: value }); 
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tags & Trạng thái
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={inputValue}
            onChange={handleTagsChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Tags (phân cách bằng dấu phẩy)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái (*)
          </label>
          <select
            name="status"
            value={formFields.status}
            onChange={handleStatusChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="draft">Phát thảo</option>
            <option value="published">Xuất bản</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TagsAndStatus;