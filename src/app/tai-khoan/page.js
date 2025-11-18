"use client";
import { updateProfile } from "@/apiServices/auth";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    phoneNumber: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState({
    email: "",
    userName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const initialData = {
        email: userData.email || "",
        userName: userData.userName || "",
        phoneNumber: userData.phoneNumber || "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
      };
      setFormData(initialData);
      setOriginalData({
        email: userData.email || "",
        userName: userData.userName || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      try {
        const updateData = {
          userName: formData.userName,
          phoneNumber: formData.phoneNumber,
        };

        if (
          showPasswordFields &&
          formData.currentPassword &&
          formData.password
        ) {
          if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
          }
          updateData.currentPassword = formData.currentPassword;
          updateData.password = formData.password;
        }

        const response = await updateProfile(updateData);

        if (response.success) {
          const updatedUser = {
            ...JSON.parse(localStorage.getItem("user")),
            userName: formData.userName,
            phoneNumber: formData.phoneNumber,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setOriginalData({
            email: formData.email,
            userName: formData.userName,
            phoneNumber: formData.phoneNumber,
          });

          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            password: "",
            confirmPassword: "",
          }));
          setIsEditing(false);
          setShowPasswordFields(false);
          toast.success(response.message || "Cập nhật thông tin thành công!");
        } else {
          toast.error(
            response.message || "Cập nhật thông tin thất bại. Vui lòng thử lại."
          );
        }
      } catch (err) {
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          "Đã có lỗi không mong muốn xảy ra!";

        toast.error(errorMessage);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...originalData,
      currentPassword: "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setShowPasswordFields(false);
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (!showPasswordFields) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl container">
      <main className="px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
        <nav className="flex flex-wrap items-center mb-6 text-sm text-gray-500 overflow-hidden">
          <Link href="/" className="hover:text-primary whitespace-nowrap">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>

          <span className="text-gray-800 truncate max-sm:max-w-[120px] sm:max-w-[200px] md:max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
            Tài khoản
          </span>
        </nav>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Thông Tin Cá Nhân
            </h2>
            <button
              type="button"
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-medium transition-all hover:scale-105 ${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-400 hover:bg-orange-500"
              }`}
            >
              <i className={`fas ${isEditing ? "fa-save" : "fa-edit"}`}></i>
              <span>{isEditing ? "Lưu" : "Chỉnh sửa"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-envelope mr-1"></i>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-user mr-1"></i>
                Tên người dùng
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-md border transition-all text-sm ${
                  isEditing
                    ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-phone mr-1"></i>
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-md border transition-all text-sm ${
                  isEditing
                    ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed"
                }`}
              />
            </div>

            {isEditing && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={togglePasswordFields}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      showPasswordFields
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    <i
                      className={`fas ${
                        showPasswordFields ? "fa-eye-slash" : "fa-key"
                      }`}
                    ></i>
                    <span>{showPasswordFields ? "Ẩn" : "Đổi mật khẩu"}</span>
                  </button>
                </div>

                {showPasswordFields && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="fas fa-lock mr-1"></i>
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="fas fa-key mr-1"></i>
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <i className="fas fa-shield-alt mr-1"></i>
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Xác nhận mật khẩu mới"
                        className={`w-full px-3 py-2 rounded-md border transition-all text-sm font-mono ${
                          formData.confirmPassword &&
                          formData.password !== formData.confirmPassword
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
                            : "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                        }`}
                      />
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Mật khẩu không khớp
                          </p>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={toggleEditMode}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-all hover:scale-105"
              >
                <i className="fas fa-save"></i>
                Lưu thay đổi
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-all hover:scale-105"
              >
                <i className="fas fa-times"></i>
                Hủy bỏ
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
