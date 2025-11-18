"use client";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  Image as ImageIcon,
  Edit,
  Save,
  X,
  ImagesIcon,
  Globe2,
} from "lucide-react";
import { API_BASE_URL } from "@/apiServices/constants";

export function ConfigCard({
  item,
  editingItem,
  editForm,
  setEditForm,
  imageFile,
  setImageFile,
  onEdit,
  onCancelEdit,
  onSave,
  onOpenFileSelect,
}) {
  const isImagePath = (value) => {
    return (
      value &&
      (value.includes("/public/") ||
        value.includes(".jpg") ||
        value.includes(".png") ||
        value.includes(".jpeg") ||
        value.includes(".gif") ||
        value.startsWith("data:image"))
    );
  };

  const getTypeIcon = (type) => {
    if (type >= 0 && type < 1) return <ImagesIcon className="w-3 h-3" />; 
    if (type >= 1 && type < 2) return <Phone className="w-3 h-3" />;
    if (type === 2) return <Mail className="w-3 h-3" />;
    if (type >= 3 && type < 4) return <MapPin className="w-3 h-3" />;
    if (type === 4) return <Clock className="w-3 h-3" />;
    if (type === 0) return <ImageIcon className="w-3 h-3" />;
    if (type >= 5 && type < 6) return <Globe2 className="w-3 h-3" />;
    return <Settings className="w-3 h-3" />;
  };

  const getTypeColor = (type) => {
    if (type >= 0 && type < 1) return "bg-yellow-100 text-yellow-800";
    if (type >= 1 && type < 2) return "bg-blue-100 text-blue-800";
    if (type === 2) return "bg-green-100 text-green-800";
    if (type >= 3 && type < 4) return "bg-purple-100 text-purple-800";
    if (type === 4) return "bg-orange-100 text-orange-800";
    if (type === 0) return "bg-pink-100 text-pink-800";
    if (type >= 5 && type < 6) return "bg-sky-100 text-sky-800"; 
    return "bg-gray-100 text-gray-800";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditForm({ ...editForm, value: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getImageUrl = (value) => {
    if (!value) return "";
    if (value.startsWith("data:image")) {
      return value;
    }
    return `${API_BASE_URL}${value}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 min-w-0">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1 rounded-md ${getTypeColor(item.type)}`}>
              {getTypeIcon(item.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3
                  title={item.other}
                  className="font-semibold text-gray-900 text-sm truncate"
                >
                  {editingItem === item._id ? (
                    <input
                      type="text"
                      value={editForm.other}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          other: e.target.value,
                        })
                      }
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  ) : (
                    item.other
                  )}
                </h3>
              </div>
              <p className="text-xs text-gray-500 font-mono truncate">
                {item.key}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {editingItem === item._id ? (
              <>
                <button
                  onClick={() => onSave(item)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  <Save className="w-3 h-3" />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <button
                onClick={() => onEdit(item)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Giá trị
              </label>
              {editingItem === item._id ? (
                <div className="space-y-2">
                  {isImagePath(item.value) ? (
                    <>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {(editForm.value || imageFile) && (
                          <div className="mt-2 flex justify-center">
                            <img
                              src={getImageUrl(editForm.value)}
                              alt="Preview"
                              className="w-20 h-20 object-cover rounded-md border border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenFileSelect(item.key)}
                        className="w-full text-sm py-1 px-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Chọn từ hệ thống
                      </button>
                    </>
                  ) : (
                    <textarea
                      value={editForm.value}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          value: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  )}
                </div>
              ) : (
                <div>
                  {isImagePath(item.value) ? (
                    <div className="flex justify-center">
                      <img
                        src={getImageUrl(item.value)}
                        alt={item.other}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                      />
                    </div>
                  ) : (
                    <p 
                      className="text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-200 text-sm truncate"
                      title={item.value}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Type: {item.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
