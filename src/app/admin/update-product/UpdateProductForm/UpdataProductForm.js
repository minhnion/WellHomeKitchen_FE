"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";

import { getAllCategories } from "@/apiServices/categories";
import { getSubCategories } from "@/apiServices/subCategory";
import { getAllBrands } from "@/apiServices/brand";
import { getProductBySku, updateProduct } from "@/apiServices/products";
import { uploadImage } from "@/apiServices/upload";
import { base64ToFile } from "@/utils/base64ToFile";
import { API_BASE_URL } from "@/apiServices/constants";

import GalleryImage from "@/components/CreateAndUpdateProduct/GalleryImage";
import Organize from "@/components/CreateAndUpdateProduct/Organize";
import Pricing from "@/components/CreateAndUpdateProduct/Pricing";
import ProductInfo from "@/components/CreateAndUpdateProduct/ProductInfo";
import Specification from "@/components/CreateAndUpdateProduct/Specification";
import FileSelectModal from "@/components/FileSelectModal/FileSelectModal";
import { getCategoryAttributes } from "@/apiServices/categoryAttribute";

const IntroductionEditor = dynamic(
  () => import("@/components/CreateAndUpdateProduct/IntroductionEditor"),
  { ssr: false }
);

export default function UpdateProductForm() {
  const searchParams = useSearchParams();

  const [skuFromInput, setSkuFromInput] = useState("");
  const [formFields, setFormFields] = useState(null);
  const [productId, setProductId] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  const editorRef = useRef(null);
  const descriptionEditorRef = useRef(null); // Added ref for description editor
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);

  const isSpecialOptions = [
    { value: false, name: "Không" },
    { value: true, name: "Có" },
  ];

  const handleOpenImageModal = useCallback((target) => {
    setModalTarget(target);
    setIsFileModalOpen(true);
  }, []);

  const handleFileSelectedFromModal = (file) => {
    const imageUrl = file.path;
    if (modalTarget === "mainImage") {
      handleChangeFormFields({ ...formFields, mainImage: imageUrl });
    } else if (modalTarget === "gallery") {
      const newImage = {
        id: uuidv4(),
        url: imageUrl,
        name: file.name,
        size: "N/A",
      };
      handleChangeFormFields({
        ...formFields,
        galleryImages: [...(formFields.galleryImages || []), newImage],
      });
    } else if (modalTarget === "editor") {
      editorRef.current?.insertImage(new URL(imageUrl, API_BASE_URL).href);
    } else if (modalTarget === "description") {
      descriptionEditorRef.current?.insertImage(
        new URL(imageUrl, API_BASE_URL).href
      );
    }
    setIsFileModalOpen(false);
  };

  const loadProductBySku = useCallback(async (currentSku) => {
    if (!currentSku) return;
    setFormFields(null);
    setProductId(null);
    try {
      const data = await getProductBySku(currentSku);
      if (data && data._id) {
        const transformedGallery = (data.galleryImages || []).map(
          (imageUrl) => ({
            id: uuidv4(),
            url: imageUrl,
            name: imageUrl.split("/").pop() || "image",
            size: "N/A",
          })
        );

        let finalSpecifications = data.specifications || [];
        const categoryId = data.category?._id || data.category;

        if (categoryId) {
          const [subCats, brands, categoryAttributesData] = await Promise.all([
            getSubCategories(categoryId),
            getAllBrands(categoryId),
            getCategoryAttributes(categoryId),
          ]);

          setSubCategoryOptions(subCats || []);
          setBrandOptions(brands || []);

          const defaultAttributeKeys = categoryAttributesData?.attributes || [];
          if (defaultAttributeKeys.length > 0) {
            const existingKeys = new Set(
              finalSpecifications.map((spec) => spec.key)
            );

            const newSpecsToAdd = defaultAttributeKeys
              .filter((key) => !existingKeys.has(key))
              .map((key, index) => ({
                _id: Date.now() + index,
                key: key,
                value: "",
              }));

            finalSpecifications = [...finalSpecifications, ...newSpecsToAdd];
          }
        } else {
          setSubCategoryOptions([]);
          setBrandOptions([]);
        }

        setFormFields({
          ...data,
          galleryImages: transformedGallery,
          specifications: finalSpecifications,
          description: data.description || "", // Keep as string
        });

        setProductId(data._id);
      } else {
        toast.error(`Không tìm thấy sản phẩm với SKU: ${currentSku}`);
      }
    } catch (error) {
      toast.error("Lấy thông tin sản phẩm thất bại");
    }
  }, []);

  useEffect(() => {
    getAllCategories().then(setCategoryOptions).catch(console.error);
  }, []);

  useEffect(() => {
    const skuFromUrl = searchParams.get("sku");
    if (skuFromUrl) {
      setSkuFromInput(skuFromUrl);
      loadProductBySku(skuFromUrl);
    }
  }, [searchParams, loadProductBySku]);

  const handleManualLoad = () => {
    if (skuFromInput) {
      loadProductBySku(skuFromInput);
    } else {
      toast.warn("Vui lòng nhập SKU sản phẩm.");
    }
  };

  const handleChangeFormFields = (updated) => setFormFields(updated);

  const handleChangeIntroductionContent = useCallback((content) => {
    setFormFields((prev) =>
      prev ? { ...prev, introductionContent: content } : null
    );
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setFormFields((prev) => ({
      ...prev,
      category: categoryId,
      subCategory: "",
      brand: "",
    }));
    setSubCategoryOptions([]);
    setBrandOptions([]);
    if (categoryId) {
      try {
        const [subCategoriesData, brandsData, categoryAttributesData] =
          await Promise.all([
            getSubCategories(categoryId),
            getAllBrands(categoryId),
            getCategoryAttributes(categoryId),
          ]);
        setSubCategoryOptions(subCategoriesData || []);
        setBrandOptions(brandsData || []);

        const defaultAttributeKeys = categoryAttributesData?.attributes || [];

        if (defaultAttributeKeys && defaultAttributeKeys.length > 0) {
          setFormFields((prev) => {
            const currentSpecs = prev.specifications || [];
            const existingKeys = new Set(currentSpecs.map((spec) => spec.key));

            const newSpecsToAdd = defaultAttributeKeys
              .filter((key) => !existingKeys.has(key))
              .map((key, index) => ({
                _id: Date.now() + index,
                key: key,
                value: "",
              }));

            return {
              ...prev,
              specifications: [...currentSpecs, ...newSpecsToAdd],
            };
          });
        }
      } catch (error) {
        console.log("Error fetching subcategories/brands:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formFields || !productId) {
      toast.warn("Vui lòng tải thông tin sản phẩm trước khi cập nhật.");
      return;
    }
    try {
      let finalMainImageUrl = formFields.mainImage;
      if (formFields.mainImage instanceof File) {
        finalMainImageUrl = await uploadImage(
          formFields.mainImage,
          `${formFields.name}_main_${Date.now()}`
        );
      }

      const finalGalleryImageUrls = await Promise.all(
        (formFields.galleryImages || [])
          .map(async (image) => {
            if (image.file instanceof File) {
              return uploadImage(
                image.file,
                `${formFields.name}_gallery_${image.name || Date.now()}`
              );
            }
            return image.url;
          })
          .filter(Boolean)
      );

      const validSpecifications = formFields.specifications.filter(
        (spec) => spec.key.trim() && spec.value.trim()
      );

      const specificationsToSave = validSpecifications.map((spec) => {
        if (typeof spec._id === "number") {
          const { _id, ...rest } = spec;
          return rest;
        }
        return spec;
      });

      // Process description for base64 images
      let processedDescription = formFields.description;
      if (processedDescription.includes("data:image/")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(processedDescription, "text/html");
        const images = doc.querySelectorAll("img[src^='data:image/']");
        const uploadPromises = Array.from(images).map(async (img) => {
          const base64Src = img.getAttribute("src");
          const imageName = `${
            formFields.name || "desc"
          }_content_${Date.now()}.png`;
          const imageFile = base64ToFile(base64Src, imageName);
          const uploadedUrl = await uploadImage(imageFile, imageName);
          img.setAttribute("src", uploadedUrl);
        });
        await Promise.all(uploadPromises);
        processedDescription = doc.body.innerHTML;
      }

      const processedIntroductionContent = await Promise.all(
        (formFields.introductionContent || []).map(async (block) => {
          if (
            block.type === "image" &&
            block.data.url &&
            block.data.url.startsWith("data:image/")
          ) {
            const imageName = `${
              formFields.name || "intro"
            }_content_${Date.now()}.png`;
            const imageFile = base64ToFile(block.data.url, imageName);
            return {
              ...block,
              data: {
                ...block.data,
                url: await uploadImage(imageFile, imageName),
              },
            };
          }
          return block;
        })
      );

      const payload = {
        ...formFields,
        mainImage: finalMainImageUrl,
        galleryImages: finalGalleryImageUrls,
        price: parseFloat(formFields.price),
        discountPercent: parseFloat(formFields.discountPercent || 0),
        specifications: specificationsToSave,
        description: processedDescription, // Send as HTML string
        introductionContent: processedIntroductionContent,
      };

      const result = await updateProduct(productId, payload);
      if (result.success)
        toast.success(result.message || "Cập nhật sản phẩm thành công!");
      else toast.error(result.message || "Cập nhật thất bại!");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Nhập mã sku sản phẩm"
          value={skuFromInput}
          onChange={(e) => setSkuFromInput(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={handleManualLoad}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Lấy thông tin sản phẩm
        </button>
      </div>
      {formFields ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">Cập nhật sản phẩm</h1>
              <a
                href={`/san-pham/${formFields.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                title="Xem sản phẩm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="text-sm font-medium">Xem sản phẩm</span>
              </a>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProductInfo
                ref={descriptionEditorRef}
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
                onOpenImageModal={handleOpenImageModal}
              />
              <GalleryImage
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
                onOpenImageModal={() => handleOpenImageModal("gallery")}
              />
              <IntroductionEditor
                ref={editorRef}
                introductionContent={formFields.introductionContent || []}
                onChangeIntroductionContent={handleChangeIntroductionContent}
                onOpenImageModal={() => handleOpenImageModal("editor")}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <Pricing
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
              />
              <Organize
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
                categoryOptions={categoryOptions}
                subCategoryOptions={subCategoryOptions}
                brandOptions={brandOptions}
                isSpecialOptions={isSpecialOptions}
                onCategoryChange={handleCategoryChange}
              />
              <Specification
                formFields={formFields}
                onChangeFormFields={handleChangeFormFields}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Vui lòng nhập SKU và nhấn "Lấy thông tin sản phẩm" để bắt đầu.
        </div>
      )}

      <FileSelectModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileSelect={handleFileSelectedFromModal}
      />
    </div>
  );
}
