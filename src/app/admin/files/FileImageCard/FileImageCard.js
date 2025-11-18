import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

const FileImageCard = ({
  name,
  originalName,
  path,
  onDeleteClick,
  onImageClick,
}) => {
  const handleImageClick = (e) => {
    e.stopPropagation();
    onImageClick({ name, originalName, path });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteClick({ name, path });
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-2 w-34 hover:shadow-lg transition-shadow">
      <div
        className="relative w-full h-24 mb-2 cursor-pointer group"
        onClick={handleImageClick}
      >
        <Image
          src={`${API_BASE_URL}${path}`}
          alt={originalName || name || "Image"}
          fill
          className="object-cover rounded-md transition-transform group-hover:scale-105"
          sizes="144px"
          priority={false}
        />
        <div className="absolute inset-0 rounded-md flex items-center justify-center">
          <span className="text-white px-2 py-1 rounded">Click để xem</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-900 truncate" title={name}>
          Tên: {name}
        </p>
        <p className="text-xs text-gray-600 truncate" title={originalName}>
          File gốc: {originalName}
        </p>
      </div>

      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors z-10"
        aria-label="Delete file"
      >
        <FaTrash className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FileImageCard;
