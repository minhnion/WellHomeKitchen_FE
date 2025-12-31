"use client";

import { Drawer, Checkbox } from "@mui/material";
import { Filter, X, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const FilterPanel = ({
  open,
  onClose,
  filtered,
  changeFiltered,
  brands = [],
  subCategories = [],
}) => {
  /* ================= DATA ================= */
  const priceFilterData = [
    { id: 1, label: "Dưới 10 Triệu", minPrice: 0, maxPrice: 10000000 },
    { id: 2, label: "10 - 15 Triệu", minPrice: 10000000, maxPrice: 15000000 },
    { id: 3, label: "15 - 20 Triệu", minPrice: 15000000, maxPrice: 20000000 },
    { id: 4, label: "Trên 20 Triệu", minPrice: 20000000, maxPrice: null },
  ];

  const sortOptions = [
    { id: "newest", label: "Mới" },
    { id: "bestseller", label: "Bán chạy" },
    { id: "discount", label: "Giảm giá" },
    { id: "price-asc", label: "Giá thấp - cao" },
    { id: "price-desc", label: "Giá cao - thấp" },
  ];

  /* ================= TEMP FILTER ================= */
  const [tempFiltered, setTempFiltered] = useState(filtered);

  useEffect(() => {
    if (open) setTempFiltered(filtered);
  }, [open]);

  /* ================= COLLAPSE ================= */
  const [openSections, setOpenSections] = useState({
    sort: true,
    brand: true,
    price: true,
    subCategory: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ================= SORT ================= */
  const isSortActive = (id) => {
    if (id === "price-asc") return tempFiltered.sortPrice === "asc";
    if (id === "price-desc") return tempFiltered.sortPrice === "desc";
    return tempFiltered[id];
  };

  const handleSortClick = (id) => {
    if (id.startsWith("price")) {
      setTempFiltered({
        ...tempFiltered,
        newest: false,
        bestseller: false,
        discount: false,
        sortPrice: id.endsWith("asc") ? "asc" : "desc",
      });
    } else {
      setTempFiltered({
        ...tempFiltered,
        newest: id === "newest",
        bestseller: id === "bestseller",
        discount: id === "discount",
        sortPrice: null,
      });
    }
  };

  /* ================= SINGLE VALUE ================= */
  const toggleSingleValue = (key, value) => {
    if (tempFiltered[key] === value) {
      const next = { ...tempFiltered };
      delete next[key];
      setTempFiltered(next);
    } else {
      setTempFiltered({ ...tempFiltered, [key]: value });
    }
  };

  /* ================= PRICE ================= */
  const togglePrice = (p) => {
    if (
      tempFiltered.minPrice === p.minPrice &&
      tempFiltered.maxPrice === p.maxPrice
    ) {
      const next = { ...tempFiltered };
      delete next.minPrice;
      delete next.maxPrice;
      setTempFiltered(next);
    } else {
      setTempFiltered({
        ...tempFiltered,
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
      });
    }
  };

  /* ================= UI PARTS ================= */
  const SectionHeader = ({ title, open, onClick }) => (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-3 cursor-pointer"
    >
      <span className="text-sm font-medium">{title}</span>
      {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
    </div>
  );



  /* ================= RENDER ================= */
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
        },
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between bg-blue-800 text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <span className="font-semibold text-sm">Bộ lọc</span>
        </div>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* ===== BODY ===== */}
      <div className="p-4 overflow-y-auto flex-1">
        {/* SORT */}
        <SectionHeader
          title="Sắp xếp"
          open={openSections.sort}
          onClick={() => toggleSection("sort")}
        />
        {openSections.sort &&
          sortOptions.map((s) => (
            <label key={s.id} className="flex items-center gap-2 py-1">
              <Checkbox
                checked={isSortActive(s.id)}
                onChange={() => handleSortClick(s.id)}
              />
              <span className="text-sm">{s.label}</span>
            </label>

          ))}
        <div className="border-b my-1" />



        {/* BRAND */}
        {brands.length > 0 && (
          <>
            <SectionHeader
              title="Hãng"
              open={openSections.brand}
              onClick={() => toggleSection("brand")}
            />

            {openSections.brand &&
              brands.map((b) => (
                <label key={b._id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={tempFiltered.brand === b._id}
                    onChange={() => toggleSingleValue("brand", b._id)}
                  />
                  <span className="text-sm">{b.name}</span>
                </label>
              ))}

            <div className="border-b my-1" />
          </>
        )}


        {/* PRICE */}
        <SectionHeader
          title="Khoảng giá"
          open={openSections.price}
          onClick={() => toggleSection("price")}
        />

        {openSections.price &&
          priceFilterData.map((p) => {
            const active =
              tempFiltered.minPrice === p.minPrice &&
              tempFiltered.maxPrice === p.maxPrice;

            return (
              <label key={p.id} className="flex items-center gap-2 py-1">
                <Checkbox checked={active} onChange={() => togglePrice(p)} />
                <span className="text-sm">{p.label}</span>
              </label>
            );
          })}

        <div className="border-b my-1" />

        {/* SUB CATEGORY */}
        {subCategories.length > 0 && (
          <>
            <SectionHeader
              title="Phân loại"
              open={openSections.subCategory}
              onClick={() => toggleSection("subCategory")}
            />

            {openSections.subCategory &&
              subCategories.map((s) => (
                <label key={s._id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={tempFiltered.subCategory === s._id}
                    onChange={() => toggleSingleValue("subCategory", s._id)}
                  />
                  <span className="text-sm">{s.name}</span>
                </label>
              ))}
          </>
        )}

      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex gap-3 p-4 border-t">
        <button
          onClick={() => {
            setTempFiltered(filtered);
            onClose();
          }}
          className="flex-1 py-2 border bg-gray-100 text-sm"
        >
          HỦY
        </button>
        <button
          onClick={() => {
            changeFiltered(tempFiltered);
            onClose();
          }}
          className="flex-1 py-2 bg-black text-white text-sm"
        >
          ÁP DỤNG
        </button>
      </div>
    </Drawer>
  );
};

export default FilterPanel;
