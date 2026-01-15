"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { createProduct } from "@/apiServices/products";
import { uploadImage } from "@/apiServices/upload";
import { getAllCategories } from "@/apiServices/categories";
import { getSubCategories } from "@/apiServices/subCategory";
import { getAllBrands } from "@/apiServices/brand";
import { getCategoryAttributes } from "@/apiServices/categoryAttribute";
import { base64ToFile } from "@/utils/base64ToFile";
import { API_BASE_URL } from "@/apiServices/constants";

import GalleryImage from "@/components/CreateAndUpdateProduct/GalleryImage";
import Organize from "@/components/CreateAndUpdateProduct/Organize";
import Pricing from "@/components/CreateAndUpdateProduct/Pricing";
import ProductInfo from "@/components/CreateAndUpdateProduct/ProductInfo";
import Specification from "@/components/CreateAndUpdateProduct/Specification";
import FileSelectModal from "@/components/FileSelectModal/FileSelectModal";

const IntroductionEditor = dynamic(
  () => import("@/components/CreateAndUpdateProduct/IntroductionEditor"),
  { ssr: false }
);

const initialFormState = {
  name: "",
  sku: "",
  description: "",
  mainImage: null,
  price: "",
  salePrice: "",
  discountPercent: "",
  specifications: [{ _id: Date.now(), key: "", value: "" }],
  category: "",
  subCategory: "",
  brand: "",
  isSpecial: false,
  galleryImages: [],
  introductionContent: [],
};

export default function AddProductPage() {
  const [formFields, setFormFields] = useState({ ...initialFormState });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const isSpecialOptions = [
    { value: false, name: "Không" },
    { value: true, name: "Có" },
  ];
  const editorRef = useRef(null);
  const descriptionEditorRef = useRef(null);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState(null);

  const handleOpenImageModal = useCallback((target) => {
    setModalTarget(target);
    setIsFileModalOpen(true);
  }, []);

  const handleFileSelectedFromModal = (file) => {
    const imageUrl = file.path;
    if (modalTarget === "mainImage") {
      setFormFields((prev) => ({ ...prev, mainImage: imageUrl }));
    } else if (modalTarget === "gallery") {
      const newImage = {
        id: uuidv4(),
        url: imageUrl,
        name: file.name,
        size: "N/A",
      };
      setFormFields((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newImage],
      }));
    } else if (modalTarget === "editor") {
      editorRef.current?.insertImage(new URL(imageUrl, API_BASE_URL).href);
    } else if (modalTarget === "description") {
      descriptionEditorRef.current?.insertImage(
        new URL(imageUrl, API_BASE_URL).href
      );
    }
    setIsFileModalOpen(false);
  };

  const handleChangeFormFields = useCallback((updatedFields) => {
    setFormFields(updatedFields);
  }, []);

  const handleChangeIntroductionContent = useCallback((content) => {
    setFormFields((prev) => ({ ...prev, introductionContent: content }));
  }, []);

  const handleCategoryChange = useCallback(async (categoryId) => {
    if (!categoryId) {
      setFormFields((prev) => ({
        ...prev,
        category: "",
        subCategory: "",
        brand: "",
        specifications: [{ _id: Date.now(), key: "", value: "" }],
      }));
      setSubCategoryOptions([]);
      setBrandOptions([]);
      return;
    }
    try {
      const [subCategoriesData, brandsData, categoryAttributesData] =
        await Promise.all([
          getSubCategories(categoryId),
          getAllBrands(categoryId),
          getCategoryAttributes(categoryId),
        ]);
      let newSpecifications =
        categoryAttributesData?.attributes?.length > 0
          ? categoryAttributesData.attributes.map((attrKey, index) => ({
            _id: Date.now() + index,
            key: attrKey,
            value: "",
          }))
          : [{ _id: Date.now(), key: "", value: "" }];
      setFormFields((prev) => ({
        ...prev,
        category: categoryId,
        subCategory: "",
        brand: "",
        specifications: newSpecifications,
      }));
      setSubCategoryOptions(subCategoriesData || []);
      setBrandOptions(brandsData || []);
    } catch (error) {
      console.log("Error fetching data on category change:", error);
      toast.error("Lỗi khi tải dữ liệu cho danh mục!");
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormFields({ ...initialFormState });
    setSubCategoryOptions([]);
    setBrandOptions([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      let mainImageUrl = formFields.mainImage;
      if (formFields.mainImage instanceof File) {
        mainImageUrl = await uploadImage(formFields.mainImage, formFields.name);
      }

      const galleryImageUrls = await Promise.all(
        formFields.galleryImages.map((image) => {
          if (image.file) {
            return uploadImage(image.file, image.name);
          }
          return image.url;
        })
      );

      const originalPrice = parseFloat(formFields.price);
      const salePrice = parseFloat(formFields.salePrice);

      let computedDiscountPercent = 0;

      if (originalPrice && salePrice && salePrice < originalPrice) {
        computedDiscountPercent = ((originalPrice - salePrice) / originalPrice) * 100;
      }


      const validSpecifications = formFields.specifications.filter(
        (spec) => spec.key.trim() && spec.value.trim()
      );

      const specificationStandard = validSpecifications.map(
        ({ _id, ...rest }) => rest
      );

      let processedDescription = formFields.description;
      if (processedDescription.includes("data:image/")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(processedDescription, "text/html");
        const images = doc.querySelectorAll("img[src^='data:image/']");
        const uploadPromises = Array.from(images).map(async (img) => {
          const base64Src = img.getAttribute("src");
          const imageName = `${formFields.name || "desc"
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
            const imageName = `${formFields.name || "intro"
              }_content_${Date.now()}.png`;
            const imageFile = base64ToFile(block.data.url, imageName);
            const uploadedUrl = await uploadImage(imageFile, imageName);
            return { ...block, data: { ...block.data, url: uploadedUrl } };
          }
          return block;
        })
      );

      const payload = {
        name: formFields.name,
        sku: formFields.sku,
        description: processedDescription,
        mainImage: mainImageUrl,
        price: parseFloat(formFields.price),
        discountPercent: computedDiscountPercent,
        category: formFields.category,
        subCategory: formFields.subCategory,
        brand: formFields.brand,
        specifications: specificationStandard,
        galleryImages: galleryImageUrls,
        introductionContent: processedIntroductionContent,
      };

      const response = await createProduct(payload);
      if (response.success) {
        toast.success(response.message || "Thêm sản phẩm thành công!");
        resetForm();
      } else {
        toast.error(response.message || "Thêm sản phẩm thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  }, [formFields, resetForm]);

  useEffect(() => {
    getAllCategories().then(setCategoryOptions).catch(console.error);
  }, []);

  return (
    <div className="max-w-8xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
          <p className="text-sm text-gray-500">
            Quản lý sản phẩm cửa hàng của bạn
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Tạo sản phẩm
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo
            formFields={formFields}
            onChangeFormFields={handleChangeFormFields}
            onOpenImageModal={() => handleOpenImageModal("mainImage")}
          />
          <GalleryImage
            formFields={formFields}
            onChangeFormFields={handleChangeFormFields}
            onOpenImageModal={() => handleOpenImageModal("gallery")}
          />
          <IntroductionEditor
            ref={editorRef}
            introductionContent={formFields.introductionContent}
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

      <FileSelectModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileSelect={handleFileSelectedFromModal}
      />
    </div>
  );
}
