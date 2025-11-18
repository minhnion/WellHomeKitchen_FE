import { API_BASE_URL } from "@/apiServices/constants";
import Image from "next/image";
import Modal from "react-modal";
import { FaTimes, FaDownload } from "react-icons/fa";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",

    border: "none",
    borderRadius: "8px",
    padding: "0px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "hidden",
    width: "600px",
    position: "absolute",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
};

const ImageViewModal = ({ isOpen, onClose, image }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}${image.path}`;
    link.download = image.originalName || image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {image.originalName}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            Tên file: {image.name}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Download"
          >
            <FaDownload className="h-5 w-5" />
          </button>

          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Close"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image container */}
      <div className="relative overflow-auto max-h-[calc(90vh-80px)]">
        <div className="flex items-center justify-center min-h-[300px] p-4">
          <div className="relative max-w-full max-h-full">
            <Image
              src={`${API_BASE_URL}${image.path}`}
              alt={image.originalName || image.name}
              width={400}
              height={200}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageViewModal;
