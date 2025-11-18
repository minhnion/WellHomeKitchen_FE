"use client";
import React from "react";

const Specification = ({ formFields, onChangeFormFields }) => {
  const specifications = formFields.specifications || [
    { _id: Date.now(), key: "", value: "" },
  ];

  const handleKeyChange = (id, key) => {
    const updatedSpecs = specifications.map((spec) =>
      spec._id === id ? { ...spec, key } : spec
    );
    onChangeFormFields({ ...formFields, specifications: updatedSpecs });
  };

  const handleValueChange = (id, value) => {
    const updatedSpecs = specifications.map((spec) =>
      spec._id === id ? { ...spec, value } : spec
    );
    onChangeFormFields({ ...formFields, specifications: updatedSpecs });
  };

  const addSpecification = () => {
    const updatedSpecs = [
      ...specifications,
      { _id: Date.now(), key: "", value: "" },
    ];
    onChangeFormFields({ ...formFields, specifications: updatedSpecs });
  };

  const removeSpecification = (id) => {
    if (specifications.length > 1) {
      const updatedSpecs = specifications.filter((spec) => spec._id !== id);
      onChangeFormFields({ ...formFields, specifications: updatedSpecs });
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Thông số kỹ thuật
      </h3>

      <div className="space-y-3">
        {specifications.map((spec, index) => (
          <div key={spec._id} className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={spec.key}
                onChange={(e) => handleKeyChange(spec._id, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
                placeholder="Thuộc tính"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                value={spec.value}
                onChange={(e) => handleValueChange(spec._id, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 pr-8"
                placeholder="Giá trị"
              />
              {specifications.length > 1 && (
                <button
                  onClick={() => removeSpecification(spec._id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa thuộc tính"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSpecification}
        className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
      >
        <span>+</span>
        Thêm thuộc tính
      </button>
    </div>
  );
};

export default Specification;
