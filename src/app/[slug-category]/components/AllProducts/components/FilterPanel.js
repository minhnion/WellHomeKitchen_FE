"use client";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";
import { Drawer, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FilterPanel = ({
  anchorEl,
  open,
  onClose,
  filtered,
  changeFiltered,
  brands,
  subCategories,
  attributeFieldFilter,
}) => {
  const handleClearAll = () => {
    changeFiltered({});
  };

  const handleRemoveFilter = (key) => {
    const newFiltered = { ...filtered };
    if (key === "price") {
      delete newFiltered.minPrice;
      delete newFiltered.maxPrice;
    } else {
      delete newFiltered[key];
    }
    changeFiltered(newFiltered);
  };

  // Apply filters and close the panel
  const handleViewResults = () => {
    onClose();
  };

  const priceFilterData = [
    { id: 1, label: "Dưới 10 Triệu", minPrice: 0, maxPrice: 10000000 },
    { id: 2, label: "10 - 15 Triệu", minPrice: 10000000, maxPrice: 15000000 },
    { id: 3, label: "15 - 20 Triệu", minPrice: 15000000, maxPrice: 20000000 },
    { id: 4, label: "Trên 20 Triệu", minPrice: 20000000, maxPrice: null },
  ];
  // Create list of selected filters to display
  const getSelectedFiltersDisplay = () => {
    const selectedFilters = [];

    if (filtered.brand) {
      const selectedBrand = brands.find((b) => b._id === filtered.brand);
      if (selectedBrand) {
        selectedFilters.push({
          key: "brand",
          label: selectedBrand.name,
        });
      }
    }

    if (filtered.minPrice !== undefined || filtered.maxPrice !== undefined) {
      const selectedPrice = priceFilterData.find(
        (p) =>
          p.minPrice === filtered.minPrice && p.maxPrice === filtered.maxPrice
      );
      if (selectedPrice) {
        selectedFilters.push({
          key: "price",
          label: selectedPrice.label,
        });
      }
    }

    if (filtered.subCategory && subCategories) {
      const selectedSubCategory = subCategories.find(
        (sub) => sub._id === filtered.subCategory
      );
      if (selectedSubCategory) {
        selectedFilters.push({
          key: "subCategory",
          label: selectedSubCategory.name,
        });
      }
    }

    Object.entries(attributeFieldFilter).forEach(([key, values]) => {
      if (filtered[key]) {
        const selectedValue = values.find((v) => v.value === filtered[key]);
        if (selectedValue) {
          selectedFilters.push({
            key: key,
            label: selectedValue.label,
          });
        }
      }
    });

    return selectedFilters;
  };

  const selectedFilters = getSelectedFiltersDisplay();
  const hasSelectedFilters = selectedFilters.length > 0;

  // Toggle brand selection
  const handleToggleBrand = (brandId) => {
    if (filtered.brand === brandId) {
      const newFiltered = { ...filtered };
      delete newFiltered.brand;
      changeFiltered(newFiltered);
    } else {
      changeFiltered({ ...filtered, brand: brandId });
    }
  };

  // Toggle price selection
  const handleTogglePrice = (priceItem) => {
    if (
      filtered.minPrice === priceItem.minPrice &&
      filtered.maxPrice === priceItem.maxPrice
    ) {
      const newFiltered = { ...filtered };
      delete newFiltered.minPrice;
      delete newFiltered.maxPrice;
      changeFiltered(newFiltered);
    } else {
      changeFiltered({
        ...filtered,
        minPrice: priceItem.minPrice,
        maxPrice: priceItem.maxPrice,
      });
    }
  };

  const handleToggleSubCategory = (subCategoryId) => {
    if (filtered.subCategory === subCategoryId) {
      const newFiltered = { ...filtered };
      delete newFiltered.subCategory;
      changeFiltered(newFiltered);
    } else {
      changeFiltered({ ...filtered, subCategory: subCategoryId });
    }
  };

  // Toggle attribute selection
  const handleToggleAttribute = (key, value) => {
    if (filtered[key] === value) {
      const newFiltered = { ...filtered };
      delete newFiltered[key];
      changeFiltered(newFiltered);
    } else {
      changeFiltered({ ...filtered, [key]: value });
    }
  };

  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={onClose}
      ModalProps={{
        style: {
          position: "absolute",
          zIndex: 1300,
        },
      }}
      PaperProps={{
        sx: {
          position: "absolute",
          top: anchorEl
            ? `${anchorEl.getBoundingClientRect().bottom + window.scrollY}px`
            : "0px",
          left: anchorEl
            ? `${anchorEl.getBoundingClientRect().left + window.scrollX}px`
            : "0px",
          width: {
            xs: "95%",
            sm: "90%",
            md: "800px",
          },
          maxWidth: "95vw",
          maxHeight: "75vh",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          overflowY: "auto",
          p: { xs: 1.5, sm: 2, md: 2.5 },
          m: 0,
          transform: "none !important",
        },
      }}
      SlideProps={{
        direction: "down",
        timeout: {
          enter: 400,
          exit: 300,
        },
      }}
    >
      {/* Display selected filters */}
      <div className="flex flex-wrap items-center mb-2 border-b pb-2 justify-between">
        <div className="flex flex-wrap items-center">
          <div className="font-medium text-xs sm:text-sm mr-2">Đã chọn</div>

          {selectedFilters.map((filter) => (
            <div
              key={filter.key}
              className="bg-gray-100 rounded-full px-2 py-1 m-1 flex items-center text-xs"
            >
              {filter.label}
              <button
                onClick={() => handleRemoveFilter(filter.key)}
                className="ml-1 text-gray-500 hover:text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          ))}

          {hasSelectedFilters && (
            <button
              onClick={handleClearAll}
              className="text-blue-600 hover:underline text-xs ml-2"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <IconButton onClick={onClose} size="small" className="mr-1">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {brands && (
        <>
          <Typography
            variant="subtitle2"
            className="mb-1.5 text-xs sm:text-sm font-medium"
          >
            Hãng
          </Typography>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10  gap-1 mb-3">
            {brands.map((b) => (
              <button
                key={b._id}
                onClick={() => handleToggleBrand(b._id)}
                className={`rounded-md shadow-sm hover:shadow-md transition-all duration-200 p-1 flex items-center justify-center ${
                  filtered.brand === b._id
                    ? "bg-blue-100 ring-1 ring-blue-300"
                    : "bg-white"
                }`}
              >
                <div className="relative w-full h-8">
                  {" "}
                  <Image
                    src={new URL(b.imageUrl, API_BASE_URL).href}
                    alt={b.name}
                    fill
                    sizes="(max-width: 640px) 16vw, (max-width: 768px) 12vw, 8vw"
                    className="object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
        {/* Price range */}
        <div>
          <Typography
            variant="subtitle2"
            className="mb-1.5 text-xs sm:text-sm font-medium"
          >
            Khoảng giá
          </Typography>

          <div className="grid grid-cols-2 gap-1.5">
            {priceFilterData.map((p) => (
              <button
                key={p.id}
                onClick={() => handleTogglePrice(p)}
                className={`py-1.5 px-2 rounded-md shadow-sm text-xs ${
                  filtered.minPrice === p.minPrice &&
                  filtered.maxPrice === p.maxPrice
                    ? "bg-blue-100"
                    : "bg-white"
                } hover:shadow-md transition-all`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Categories - Fixed layout */}
        {subCategories && subCategories.length > 0 && (
          <div>
            <Typography
              variant="subtitle2"
              className="mb-1.5 text-xs sm:text-sm font-medium"
            >
              Phân loại
            </Typography>
            <div className="grid grid-cols-2 gap-1.5">
              {subCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => handleToggleSubCategory(sub._id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md shadow-sm ${
                    filtered.subCategory === sub._id
                      ? "bg-blue-100"
                      : "bg-white"
                  } hover:shadow-md transition-all`}
                >
                  <div className="relative h-6 w-6 flex-shrink-0">
                    {" "}
                    <Image
                      src={new URL(sub.imageUrl, API_BASE_URL).href}
                      alt={sub.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters from attributeFieldFilter */}
        {Object.entries(attributeFieldFilter).map(([key, values]) => (
          <div key={key}>
            <Typography
              variant="subtitle2"
              className="mb-1.5 capitalize text-xs sm:text-sm font-medium"
            >
              {key.replace("-", " ")}
            </Typography>
            <div className="grid grid-cols-2 gap-1.5">
              {values.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleToggleAttribute(key, item.value)}
                  className={`py-1.5 px-2 rounded-md shadow-sm text-xs ${
                    filtered[key] === item.value ? "bg-blue-100" : "bg-white"
                  } hover:shadow-md transition-all overflow-hidden text-ellipsis`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons footer */}
      {hasSelectedFilters && (
        <div className="flex justify-center mt-4 space-x-3 pt-3 border-t">
          <button
            onClick={handleClearAll}
            className="px-4 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-all text-xs sm:text-sm"
          >
            Bỏ chọn
          </button>
          <button
            onClick={handleViewResults}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all text-xs sm:text-sm"
          >
            Xem kết quả
          </button>
        </div>
      )}
    </Drawer>
  );
};

export default FilterPanel;
