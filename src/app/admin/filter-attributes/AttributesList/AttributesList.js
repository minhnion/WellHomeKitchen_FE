import { useState } from "react";
import {
  MdEdit,
  MdDelete,
  MdSave,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";

export default function AttributesList({
  currentFilter,
  selectedCategoryId,
  setFilterData,
  setCurrentFilter,
}) {
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [expandedAttributes, setExpandedAttributes] = useState({});

  const toggleAttributeExpansion = (attributeId) => {
    setExpandedAttributes((prev) => ({
      ...prev,
      [attributeId]: !prev[attributeId],
    }));
  };

  const handleEditAttribute = (attributeId) => {
    const attribute = currentFilter?.attributes.find(
      (a) => a._id === attributeId
    );
    if (attribute) {
      setEditingAttribute({
        id: attributeId,
        key: attribute.key,
        values: attribute.values.join(", "),
      });
    }
  };

  const handleSaveAttribute = () => {
    if (!editingAttribute || !currentFilter) return;

    const values = editingAttribute.values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    const updatedFilter = {
      ...currentFilter,
      attributes: currentFilter.attributes.map((a) =>
        a._id === editingAttribute.id
          ? { ...a, key: editingAttribute.key.trim(), values }
          : a
      ),
    };

    setCurrentFilter(updatedFilter);
    setFilterData((prev) =>
      prev.map((f) => (f.categoryId === selectedCategoryId ? updatedFilter : f))
    );
    setEditingAttribute(null);
  };

  const handleDeleteAttribute = (attributeId) => {
    if (!currentFilter) return;

    const updatedFilter = {
      ...currentFilter,
      attributes: currentFilter.attributes.filter((a) => a._id !== attributeId),
    };

    setCurrentFilter(updatedFilter);
    setFilterData((prev) =>
      prev.map((f) => (f.categoryId === selectedCategoryId ? updatedFilter : f))
    );
  };

  const handleRemoveValue = (attributeId, valueIndex) => {
    if (!currentFilter) return;

    const updatedFilter = {
      ...currentFilter,
      attributes: currentFilter.attributes.map((a) =>
        a._id === attributeId
          ? { ...a, values: a.values.filter((_, i) => i !== valueIndex) }
          : a
      ),
    };

    setCurrentFilter(updatedFilter);
    setFilterData((prev) =>
      prev.map((f) => (f.categoryId === selectedCategoryId ? updatedFilter : f))
    );
  };

  return (
    <div className="space-y-4">
      {currentFilter?.attributes?.map((attribute) => (
        <div
          key={attribute._id}
          className="bg-white border border-gray-200 rounded-lg"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleAttributeExpansion(attribute._id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedAttributes[attribute._id] ? (
                    <MdKeyboardArrowDown size={20} />
                  ) : (
                    <MdKeyboardArrowRight size={20} />
                  )}
                </button>
                {editingAttribute?.id === attribute._id ? (
                  <input
                    type="text"
                    value={editingAttribute.key}
                    onChange={(e) =>
                      setEditingAttribute({
                        ...editingAttribute,
                        key: e.target.value,
                      })
                    }
                    className="text-lg font-medium border-b border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h3 className="text-lg font-medium text-gray-800">
                    {attribute.key}
                  </h3>
                )}
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {attribute.values.length} giá trị
                </span>
              </div>
              <div className="flex items-center gap-2">
                {editingAttribute?.id === attribute._id ? (
                  <>
                    <button
                      onClick={handleSaveAttribute}
                      className="text-green-600 hover:text-green-800 p-1"
                    >
                      <MdSave size={18} />
                    </button>
                    <button
                      onClick={() => setEditingAttribute(null)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                    >
                      <MdClose size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditAttribute(attribute._id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attribute._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <MdDelete size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {expandedAttributes[attribute._id] && (
            <div className="p-4">
              {editingAttribute?.id === attribute._id ? (
                <textarea
                  value={editingAttribute.values}
                  onChange={(e) =>
                    setEditingAttribute({
                      ...editingAttribute,
                      values: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phân cách các giá trị bằng dấu phẩy"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {attribute.values.map((value, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 group"
                    >
                      <span>{value}</span>
                      <button
                        onClick={() => handleRemoveValue(attribute._id, index)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MdClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {(!currentFilter?.attributes ||
        currentFilter.attributes.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có thuộc tính nào cho danh mục này</p>
          <p className="text-sm">
            Sử dụng form bên trên để thêm thuộc tính đầu tiên
          </p>
        </div>
      )}
    </div>
  );
}
