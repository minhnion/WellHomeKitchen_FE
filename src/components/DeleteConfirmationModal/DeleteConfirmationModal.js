import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",

    border: "none",
    borderRadius: "8px",
    padding: "24px",
    maxWidth: "400px",
    width: "90%",
    margin: "auto",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Bạn có muốn xóa không?",
  deleteButton = "Xóa",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Xác nhận xóa"
      style={customStyles}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          {deleteButton}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
