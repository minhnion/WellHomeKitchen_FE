"use client";
import { useState, useEffect } from "react";
import { Edit, Save, X, CreditCard } from "lucide-react";

export default function ConfigBank({ data, setData, onSave }) {
  const [banks, setBanks] = useState([]);
  const [config, setConfig] = useState(null);
  const [editingConfig, setEditingConfig] = useState(false);
  const [editForm, setEditForm] = useState({
    accountNo: "",
    accountName: "",
    bankCode: "",
    other: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch banks from VietQR API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch("https://api.vietqr.io/v2/banks");
        const data = await response.json();
        if (data.code === "00") {
          setBanks(data.data);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  // Use data prop or mock config
  useEffect(() => {
    if (data) {
      setConfig(data);
      setLoading(false);
    } else {
      // Mock config if no data provided
      const mockConfig = {
        _id: "687f645692cbbbc23fc36378",
        key: "bank",
        value: "113366668888-Test Bepanphu",
        type: 6,
        other: "970415",
        isView: true,
      };
      setConfig(mockConfig);
      setLoading(false);
    }
  }, [data]);

  // Parse config value
  const parseConfigValue = (value) => {
    if (!value) return { accountNo: "", accountName: "" };
    const parts = value.split("-");
    return {
      accountNo: parts[0] || "",
      accountName: parts[1] || "",
    };
  };

  const handleEdit = () => {
    const parsed = parseConfigValue(config?.value);
    setEditForm({
      accountNo: parsed.accountNo,
      accountName: parsed.accountName,
      bankCode: config?.other || "",
      other: config?.other || "",
    });
    setEditingConfig(true);
  };

  const handleSave = async () => {
    try {
      const newValue = `${editForm.accountNo}-${editForm.accountName}`;

      const updatedConfig = {
        ...config,
        value: newValue,
        other: editForm.bankCode,
      };

      // Use onSave callback if provided (for parent component handling)
      if (onSave && typeof onSave === "function") {
        await onSave(updatedConfig);
      } else {
        // Fallback to local state update
        setConfig(updatedConfig);
        if (setData) setData(updatedConfig);
      }

      setEditingConfig(false);
      console.log("Saving config:", updatedConfig);
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  const handleCancel = () => {
    setEditingConfig(false);
    setEditForm({
      accountNo: "",
      accountName: "",
      bankCode: "",
      other: "",
    });
  };

  const getSelectedBank = () => {
    return banks.find((bank) => bank.bin === config?.other);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 min-w-0">
        <div className="p-4">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  const selectedBank = getSelectedBank();
  const parsedValue = parseConfigValue(config?.value);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 min-w-0">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-blue-100 text-blue-800">
              <CreditCard className="w-3 h-3" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                Tài khoản ngân hàng
              </h3>
              <p className="text-xs text-gray-500 font-mono truncate">
                {config?.key}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {editingConfig ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  <Save className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="border-t border-gray-100 pt-3">
          {editingConfig ? (
            <div className="space-y-3">
              {/* Bank Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ngân hàng
                </label>
                <select
                  value={editForm.bankCode}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bankCode: e.target.value,
                      other: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn ngân hàng</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.bin}>
                      {bank.shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  value={editForm.accountNo}
                  onChange={(e) =>
                    setEditForm({ ...editForm, accountNo: e.target.value })
                  }
                  placeholder="Số tài khoản"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  value={editForm.accountName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, accountName: e.target.value })
                  }
                  placeholder="Tên tài khoản"
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Bank Display */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ngân hàng
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                  {selectedBank && (
                    <>
                      <img
                        src={selectedBank.logo}
                        alt={selectedBank.shortName}
                        className="w-6 h-6 object-contain"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-xs">
                          {selectedBank.shortName}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {selectedBank.bin}
                        </div>
                      </div>
                    </>
                  )}
                  {!selectedBank && (
                    <div className="text-gray-500 text-xs">Chưa chọn</div>
                  )}
                </div>
              </div>

              {/* Account Info Display */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Thông tin tài khoản
                </label>
                <div className="space-y-1">
                  <div className="text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-200 text-sm font-mono">
                    {parsedValue.accountNo || "Chưa có STK"}
                  </div>
                  <div className="text-gray-900 bg-gray-50 p-2 rounded-md border border-gray-200 text-xs">
                    {parsedValue.accountName || "Chưa có tên TK"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Type: {config?.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
