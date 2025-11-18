"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { FaTimes, FaUpload, FaPlus, FaTrash } from "react-icons/fa";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";
import { API_BASE_URL } from "@/apiServices/constants";
import FileSelectModal from "../FileSelectModal/FileSelectModal";

const defaultStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "8px",
    padding: "24px 48px 48px 24px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
};

export default function CreateModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  customStyles = {},
}) {
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const inputRefs = useRef({});

  useEffect(() => {
    if (!isOpen) return;
    const initial = {};
    fields.forEach((field) => {
      if (field.type === "file") {
        initial[field.name] = null;
      } else if (field.type === "select" && field.multiple) {
        initial[field.name] = [];
      } else if (field.type === "number" || field.type === "date") {
        initial[field.name] = "";
      } else if (field.type === "custom" && field.name === "products") {
        initial[field.name] = [{ productId: null, quantity: "" }];
      } else if (field.type === "boolean") {
        initial[field.name] = field.defaultValue ?? false;
      } else {
        initial[field.name] = "";
      }
    });
    setFormData(initial);
    setPreviews({});
  }, [isOpen, fields]);

  const handleOpenFileSelect = (fieldName) => {
    setSelectedField(fieldName);
    setIsFileSelectorOpen(true);
  };

  const handleFileSelected = (file) => {
    const fileUrl = new URL(file.path, API_BASE_URL).href;
    setPreviews((prev) => ({ ...prev, [selectedField]: fileUrl }));
    setFormData((prev) => ({ ...prev, [selectedField]: fileUrl }));
    setIsFileSelectorOpen(false);
    setSelectedField(null);
  };

  const handleChange = (e, name, type) => {
    let value;
    if (type === "number") {
      value = e.target.value ? Number(e.target.value) : "";
    } else {
      value = e.target.value;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooleanChange = (e, name) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e, name) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [name]: url }));
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const trigger = (name) => {
    inputRefs.current[name].click();
  };

  const handleProductChange = (index, subFieldName, value) => {
    setFormData((prev) => {
      const newProducts = [...prev.products];
      newProducts[index] = {
        ...newProducts[index],
        [subFieldName]:
          subFieldName === "quantity" ? Number(value) || "" : value,
      };
      return { ...prev, products: newProducts };
    });
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { productId: null, quantity: "" }],
    }));
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {};
    fields.forEach((field) => {
      if (field.async) {
        payload[field.name] =
          formData[field.name]?.map((option) => option.value) || [];
      } else if (field.type === "custom" && field.name === "products") {
        payload[field.name] = formData[field.name]
          .filter((product) => product.productId?.value && product.quantity)
          .map((product) => ({
            productId: product.productId.value,
            quantity: Number(product.quantity),
          }));
      } else {
        payload[field.name] = formData[field.name];
      }
    });
    onSave(payload);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel={title}
        style={{ ...defaultStyles, ...customStyles }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
          <form onSubmit={submit}>
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  {field.label}
                </label>

                {/* --- Logic render đã được cập nhật --- */}
                {field.type === "boolean" ? (
                  <div className="flex items-center space-x-6 mt-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value="true"
                        checked={formData[field.name] === true}
                        onChange={(e) => handleBooleanChange(e, field.name)}
                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        required={field.required}
                      />
                      <span className="ml-2 text-gray-700">Có</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value="false"
                        checked={formData[field.name] === false}
                        onChange={(e) => handleBooleanChange(e, field.name)}
                        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        required={field.required}
                      />
                      <span className="ml-2 text-gray-700">Không</span>
                    </label>
                  </div>
                ) : field.type === "custom" && field.name === "products" ? (
                  <div className="border border-gray-300 rounded-lg p-4">
                    {formData.products?.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 mb-2"
                      >
                        <div className="flex-1">
                          <AsyncPaginate
                            value={product.productId}
                            loadOptions={
                              field.subFields.find(
                                (sf) => sf.name === "productId"
                              ).loadOptions
                            }
                            onChange={(selected) =>
                              handleProductChange(index, "productId", selected)
                            }
                            placeholder="Chọn sản phẩm"
                            className="react-select-container"
                            classNamePrefix="react-select"
                            additional={{ page: 1 }}
                            isClearable
                            required
                          />
                        </div>
                        <div className="w-30">
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="Số lượng"
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa sản phẩm"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addProduct}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FaPlus size={16} className="mr-1" /> Thêm sản phẩm
                    </button>
                  </div>
                ) : field.async ? (
                  <AsyncPaginate
                    isMulti={field.multiple}
                    value={formData[field.name] || []}
                    loadOptions={field.loadOptions}
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: selected,
                      }))
                    }
                    placeholder={field.placeholder || "Chọn..."}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    additional={{ page: 1 }}
                  />
                ) : field.type === "text" ||
                  field.type === "number" ||
                  field.type === "date" ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={(e) => handleChange(e, field.name, field.type)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    required={field.required}
                  />
                ) : field.type === "select" ? (
                  <Select
                    isMulti={field.multiple}
                    options={field.options}
                    value={
                      field.multiple
                        ? field.options.filter((option) =>
                            formData[field.name]?.includes(option.value)
                          )
                        : field.options.find(
                            (option) => option.value === formData[field.name]
                          )
                    }
                    onChange={(selected) => {
                      if (field.multiple) {
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: selected
                            ? selected.map((option) => option.value)
                            : [],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: selected ? selected.value : "",
                        }));
                      }
                    }}
                    placeholder={field.placeholder || "Chọn..."}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                ) : field.type === "file" ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={(el) => (inputRefs.current[field.name] = el)}
                      onChange={(e) => handleFile(e, field.name)}
                      accept={field.accept}
                      className="hidden"
                    />
                    <div
                      onClick={() => trigger(field.name)}
                      className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer h-40 border-gray-300 hover:border-blue-500 transition-all"
                    >
                      {previews[field.name] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previews[field.name]}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white">
                              Thay đổi {field.label.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FaUpload className="text-gray-400 text-3xl mb-2" />
                          <p className="text-gray-500">
                            Nhấn để chọn {field.label.toLowerCase()}
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenFileSelect(field.name)}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Chọn ảnh từ hệ thống
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-all"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <FileSelectModal
        isOpen={isFileSelectorOpen}
        onClose={() => setIsFileSelectorOpen(false)}
        onFileSelect={handleFileSelected}
      />
    </>
  );
}
