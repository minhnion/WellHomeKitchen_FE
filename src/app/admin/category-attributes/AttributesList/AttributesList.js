import { useState } from "react";
import { MdEdit, MdDelete, MdSave, MdClose } from "react-icons/md";
import { toast } from "react-toastify";

export default function AttributesList({
  currentCategoryAttr,
  setCurrentCategoryAttr,
  setCategoryAttrData,
  selectedCategoryId,
}) {
  const [editing, setEditing] = useState(null);

  const handleEdit = (index, value) => {
    setEditing({ index, value });
  };

  const handleCancelEdit = () => {
    setEditing(null);
  };

  const handleSaveEdit = () => {
    if (!editing || !currentCategoryAttr) return;

    const trimmedValue = editing.value.trim();
    if (!trimmedValue) {
      toast.error("Tên thuộc tính không được để trống!");
      return;
    }

    const isDuplicate = currentCategoryAttr.attributes.some(
      (attr, index) =>
        index !== editing.index &&
        attr.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      toast.warn("Tên thuộc tính này đã tồn tại!");
      return;
    }

    const updatedAttributes = currentCategoryAttr.attributes.map((attr, i) =>
      i === editing.index ? trimmedValue : attr
    );

    const updatedData = {
      ...currentCategoryAttr,
      attributes: updatedAttributes,
    };

    setCurrentCategoryAttr(updatedData);
    setCategoryAttrData((prev) =>
      prev.map((a) => (a.categoryId === selectedCategoryId ? updatedData : a))
    );
    setEditing(null);
  };

  const handleDelete = (indexToDelete) => {
    if (!currentCategoryAttr) return;

    const updatedAttributes = currentCategoryAttr.attributes.filter(
      (_, i) => i !== indexToDelete
    );
    const updatedData = {
      ...currentCategoryAttr,
      attributes: updatedAttributes,
    };

    setCurrentCategoryAttr(updatedData);
    setCategoryAttrData((prev) =>
      prev.map((a) => (a.categoryId === selectedCategoryId ? updatedData : a))
    );
  };

  return (
    <div className="space-y-3">
      {currentCategoryAttr?.attributes?.map((attribute, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
        >
          {editing?.index === index ? (
            <div className="flex-grow flex items-center gap-2">
              <input
                type="text"
                value={editing.value}
                onChange={(e) =>
                  setEditing({ ...editing, value: e.target.value })
                }
                className="w-full px-2 py-1 border border-blue-500 rounded-md focus:outline-none"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              />
              <button
                onClick={handleSaveEdit}
                className="text-green-600 hover:text-green-800 p-1"
              >
                <MdSave size={20} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <MdClose size={20} />
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-800">{attribute}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(index, attribute)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {(!currentCategoryAttr?.attributes ||
        currentCategoryAttr.attributes.length === 0) && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Chưa có thuộc tính nào cho danh mục này.</p>
          <p className="text-sm">
            Sử dụng form bên trên để thêm thuộc tính đầu tiên.
          </p>
        </div>
      )}
    </div>
  );
}
