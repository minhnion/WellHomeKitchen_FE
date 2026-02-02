"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { FaTimes, FaUpload, FaPlus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

import { API_BASE_URL } from "@/apiServices/constants";
import { getProductsById } from "@/apiServices/products";
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
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
};

export function UpdateModal({
  isOpen,
  onClose,
  onUpdate,
  title,
  fields,
  initialData = {},
  customStyles = {},
}) {
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFileSelectorOpen, setIsFileSelectorOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const inputRefs = useRef({});

  useEffect(() => {
    if (!isOpen) return;

    const initializeFormData = async () => {
      setIsLoading(true);
      const initData = {};
      const initPreviews = {};

      fields.forEach((f) => {
        let val = initialData[f.name];

        if (f.type === "file") {
          val = val || null;
          if (typeof val === "string") {
            initPreviews[f.name] = new URL(val, API_BASE_URL).href;
          }
        } else if (f.type === "select" && !f.async) {
          if (f.multiple) {
            val = Array.isArray(val) ? val.map((item) => item._id || item) : [];
          } else {
            val = val?._id ?? val ?? null;
          }
        } else if (f.type === "date") {
          val = val ? new Date(val).toISOString().split("T")[0] : "";
        } else if (f.type === "boolean") {
          val = val ?? false;
        } else if (f.async) {
          val = null;
        } else {
          val = val ?? "";
        }

        initData[f.name] = val;
      });

      for (const field of fields.filter((f) => f.async)) {
        if (initialData[field.name]) {
          try {
            let ids = Array.isArray(initialData[field.name])
              ? initialData[field.name]
              : [initialData[field.name]];

            ids = ids.map((item) => item?._id ?? item).filter(Boolean);

            if (ids.length > 0) {
              const productPromises = ids.map((id) => getProductsById(id));
              const products = await Promise.all(productPromises);
              const options = products
                .filter((p) => p?._id)
                .map((p) => ({ value: p._id, label: p.name, price: p.price, }));

              initData[field.name] = field.multiple
                ? options
                : options[0] || null;
            }
          } catch (error) {
            console.error(
              `Error loading initial data for ${field.name}:`,
              error
            );
            initData[field.name] = field.multiple ? [] : null;
          }
        }
      }
      const salesField = fields.find(
        (f) => f.type === "custom" && f.name === "sales"
      );

      if (salesField && Array.isArray(initialData.products)) {
        initData.sales = initialData.products.map((p) => {
          const originalPrice = p.productId?.price || 0;

          let salePrice = "";
          if (originalPrice && p.salePercent !== undefined) {
            salePrice = Math.round(
              originalPrice * (1 - p.salePercent / 100)
            );
          }

          return {
            productId: p.productId
              ? {
                value: p.productId._id,
                label: p.productId.name,
                price: originalPrice,
              }
              : null,
            salePrice,
            salePercent: p.salePercent ?? "",
            saleQuantity: p.saleQuantity ?? "",
          };
        });
      }


      if (salesField && !Array.isArray(initData.sales)) {
        initData.sales = [
          {
            productId: null,
            salePrice: "",
            salePercent: "",
            saleQuantity: "",
          }
        ];
      }


      setFormData(initData);
      setPreviews(initPreviews);
      setIsLoading(false);
    };

    initializeFormData();
  }, [isOpen, fields, initialData]);

  const handleOpenFileSelect = (fieldName) => {
    setSelectedField(fieldName);
    setIsFileSelectorOpen(true);
  };

  const handleFileSelected = (file) => {
    const fileUrl = new URL(file.path, API_BASE_URL).href;
    setFormData((prev) => ({ ...prev, [selectedField]: fileUrl }));
    setPreviews((prev) => ({ ...prev, [selectedField]: fileUrl }));
    setIsFileSelectorOpen(false);
    setSelectedField(null);
  };

  const handleChange = (e, name, type) => {
    const value =
      type === "number"
        ? e.target.value
          ? Number(e.target.value)
          : ""
        : e.target.value;
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

  const handleSelectChange = (selected, field) => {
    const value = field.multiple
      ? selected
        ? selected.map((o) => o.value)
        : []
      : selected
        ? selected.value
        : null;
    setFormData((prev) => ({ ...prev, [field.name]: value }));
  };

  const handleAsyncSelectChange = (selected, field) => {
    setFormData((prev) => ({ ...prev, [field.name]: selected }));
  };

  const getSelectValue = (field) => {
    const currentValue = formData[field.name];
    if (!field.multiple) {
      return field.options.find((o) => o.value === currentValue) || null;
    }
    return Array.isArray(currentValue)
      ? field.options.filter((o) => currentValue.includes(o.value))
      : [];
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {};

    fields.forEach((field) => {
      if (field.type === "custom" && field.name === "sales") {
        payload.products =
          formData.sales
            ?.filter(
              (s) =>
                s.productId?.value &&
                s.saleQuantity
            )
            .map((s) => ({
              productId: s.productId.value,
              saleQuantity: Number(s.saleQuantity),
              salePercent:
                s.salePercent !== "" && s.salePercent !== undefined
                  ? Number(s.salePercent)
                  : undefined,
            })) || [];


      }
      else if (field.async) {
        payload[field.name] = field.multiple
          ? formData[field.name]?.map(o => o.value) || []
          : formData[field.name]?.value || null;
      }
      else {
        payload[field.name] = formData[field.name];
      }
    });

    onUpdate(payload);
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

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {fields.map((f) => (
                <div key={f.name} className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    {f.label}
                  </label>
                  {f.type === "boolean" ? (
                    <div className="flex items-center space-x-6 mt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={f.name}
                          value="true"
                          checked={formData[f.name] === true}
                          onChange={(e) => handleBooleanChange(e, f.name)}
                          className="form-radio h-4 w-4 text-blue-600"
                          required={f.required}
                        />
                        <span className="ml-2 text-gray-700">Có</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={f.name}
                          value="false"
                          checked={formData[f.name] === false}
                          onChange={(e) => handleBooleanChange(e, f.name)}
                          className="form-radio h-4 w-4 text-blue-600"
                          required={f.required}
                        />
                        <span className="ml-2 text-gray-700">Không</span>
                      </label>
                    </div>
                  ) :
                    f.type === "custom" && f.name === "sales" ? (
                      <div className="border border-gray-300 rounded-lg p-4">
                        {/* HEADER */}
                        <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-600">
                          <div className="col-span-5">Sản phẩm</div>
                          <div className="col-span-3">Giá bán</div>
                          <div className="col-span-3">Số lượng</div>
                          <div className="col-span-1"></div>
                        </div>

                        {/* ROWS */}
                        {formData.sales?.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-3 items-end mb-3"
                          >
                            {/* PRODUCT */}
                            <div className="col-span-5">
                              <AsyncPaginate
                                value={item.productId}
                                loadOptions={async (search, loaded, additional) => {
                                  const res = await f.subFields[0].loadOptions(search, loaded, additional);

                                  const selectedProducts = (formData.sales || [])
                                    .map(s => s.productId)
                                    .filter(Boolean);

                                  const map = new Map();

                                  // 1️⃣ add sale products trước
                                  selectedProducts.forEach(p => {
                                    map.set(String(p.value), p);
                                  });


                                  res.options.forEach(opt => {
                                    map.set(String(opt.value), opt);
                                  });

                                  return {
                                    ...res,
                                    options: Array.from(map.values()),
                                  };
                                }}

                                defaultOptions={true}
                                getOptionLabel={(opt) => opt.label}
                                onChange={(val) => {
                                  const arr = [...formData.sales];

                                  arr[index] = {
                                    ...arr[index],
                                    productId: val,
                                    salePrice: "",
                                    salePercent: "",
                                  };

                                  setFormData({ ...formData, sales: arr });
                                }}

                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  menu: (base) => ({ ...base, minWidth: "400px" }),
                                }}
                                additional={{ page: 1 }}
                              />


                            </div>

                            {/* SALE PRICE */}
                            <div className="col-span-3">
                              <input
                                type="number"
                                min={0}
                                value={item.salePrice || ""}
                                onChange={(e) => {
                                  const arr = [...formData.sales];
                                  const salePrice = Number(e.target.value);

                                  const originalPrice = arr[index].productId?.price;

                                  let salePercent = "";
                                  if (originalPrice && salePrice > 0 && salePrice < originalPrice) {
                                    salePercent = ((originalPrice - salePrice) / originalPrice) * 100;
                                  }

                                  arr[index] = {
                                    ...arr[index],
                                    salePrice,
                                    salePercent,
                                  };

                                  setFormData({ ...formData, sales: arr });
                                }}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập giá sale"
                              />
                            </div>


                            {/* QUANTITY */}
                            <div className="col-span-3">
                              <input
                                type="number"
                                min={1}
                                value={item.saleQuantity}
                                onChange={(e) => {
                                  const newSales = [...formData.sales];
                                  newSales[index].saleQuantity = e.target.value;
                                  setFormData({ ...formData, sales: newSales });
                                }}
                                className="w-full border rounded px-3 py-2"
                              />
                            </div>

                            {/* DELETE */}
                            <div className="col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const newSales = formData.sales.filter(
                                    (_, i) => i !== index
                                  );
                                  setFormData({ ...formData, sales: newSales });
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </div>
                            {/* ADD PRODUCT */}


                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              sales: [
                                ...(formData.sales || []),
                                {
                                  productId: null,
                                  salePrice: "",
                                  salePercent: "",
                                  saleQuantity: "",
                                },
                              ],
                            });
                          }}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          + Thêm sản phẩm
                        </button>
                      </div>
                    )

                      : f.async ? (
                        <AsyncPaginate
                          key={f.name + JSON.stringify(formData[f.name])}
                          isMulti={f.multiple}
                          value={formData[f.name] || (f.multiple ? [] : null)}
                          loadOptions={f.loadOptions}
                          onChange={(selected) =>
                            handleAsyncSelectChange(selected, f)
                          }
                          placeholder={f.placeholder || "Chọn..."}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                        />
                      ) : f.type === "select" ? (
                        <Select
                          key={f.name + JSON.stringify(formData[f.name])}
                          options={f.options}
                          value={getSelectValue(f)}
                          onChange={(selected) => handleSelectChange(selected, f)}
                          isMulti={f.multiple}
                          placeholder={f.placeholder || "Chọn..."}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                        />
                      ) : f.type === "text" ||
                        f.type === "number" ||
                        f.type === "date" ? (
                        <input
                          type={f.type}
                          value={formData[f.name] ?? ""}
                          onChange={(e) => handleChange(e, f.name, f.type)}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required={f.required}
                        />
                      ) : f.type === "file" ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            ref={(el) => (inputRefs.current[f.name] = el)}
                            onChange={(e) => handleFile(e, f.name)}
                            accept={f.accept}
                            className="hidden"
                          />
                          <div
                            onClick={() => inputRefs.current[f.name]?.click()}
                            className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer h-40 border-gray-300 hover:border-blue-500"
                          >
                            {previews[f.name] ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={previews[f.name]}
                                  alt="preview"
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="text-center text-gray-500">
                                <FaUpload className="mx-auto text-3xl mb-2" />
                                <p>Chọn {f.label.toLowerCase()}</p>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenFileSelect(f.name)}
                            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
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
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          )}
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
