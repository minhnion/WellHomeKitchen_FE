"use client";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllConfig, updateConfigByKey } from "@/apiServices/config";
import { uploadImage } from "@/apiServices/upload";
import { toast } from "react-toastify";
import { ConfigCard } from "./ConfigCard/ConfigCard";
import FileSelectModal from "@/components/FileSelectModal/FileSelectModal";
import ConfigBank from "./ConfigBank";

export default function SettingsPage() {
  const [data, setData] = useState([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ value: "", other: "" });
  const [imageFile, setImageFile] = useState(null);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [dataBank, setDataBank] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllConfig();
        if (response) {
          const filteredData = response.data.filter(
            (item) => item.key !== "bank"
          );
          setDataBank(
            response.data.find((item) => item.key === "bank") || null
          );
          setData(filteredData);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchData();
  }, [triggerRefresh]);

  const handleOpenFileSelect = () => {
    setIsFileModalOpen(true);
  };

  const handleFileSelectedFromModal = (file) => {
    setEditForm({ ...editForm, value: file.path });
    setImageFile(null);
    setIsFileModalOpen(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditForm({ value: item.value, other: item.other });
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({ value: "", other: "" });
    setImageFile(null);
  };

  const handleSave = async (item) => {
    try {
      let updatedValue = editForm.value;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile, item.key);
        if (uploadedUrl) {
          updatedValue = uploadedUrl;
        } else {
          toast.error("Tải ảnh lên thất bại!");
          return;
        }
      }

      const formData = {
        value: updatedValue,
        other: editForm.other,
      };

      const response = await updateConfigByKey(item.key, formData);

      if (response && response.success) {
        setTriggerRefresh(!triggerRefresh);
        setEditingItem(null);
        setEditForm({ value: "", other: "" });
        setImageFile(null);
        toast.success(response.message || "Cập nhật cấu hình thành công!");
      } else {
        toast.error(response.message || "Cập nhật cấu hình thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
    }
  };

  const handleSaveBank = async (updatedConfig) => {
    try {
      const formData = {
        value: updatedConfig.value,
        other: updatedConfig.other,
      };

      const response = await updateConfigByKey("bank", formData);

      if (response && response.success) {
        setDataBank(updatedConfig);
        setTriggerRefresh(!triggerRefresh);
        toast.success(
          response.message || "Cập nhật cấu hình ngân hàng thành công!"
        );
      } else {
        toast.error(
          response.message || "Cập nhật cấu hình ngân hàng thất bại!"
        );
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Đã có lỗi không mong muốn xảy ra!";

      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 bg-blue-600 rounded-md">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cấu Hình Hệ Thống
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ConfigBank
          data={dataBank}
          setData={setDataBank}
          onSave={handleSaveBank}
        />
      </div>
      {/* line */}
      <hr className="my-4 border-gray-200" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.map((item) => (
          <ConfigCard
            key={item._id}
            item={item}
            editingItem={editingItem}
            editForm={editForm}
            setEditForm={setEditForm}
            imageFile={imageFile}
            setImageFile={setImageFile}
            onEdit={handleEdit}
            onCancelEdit={handleCancelEdit}
            onSave={handleSave}
            onOpenFileSelect={handleOpenFileSelect}
          />
        ))}
      </div>

      <FileSelectModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileSelect={handleFileSelectedFromModal}
      />
    </div>
  );
}
