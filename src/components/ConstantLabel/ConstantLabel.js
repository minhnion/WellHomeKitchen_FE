// Special Background Types - 10 màu đặc biệt
export const SPECIAL_BACKGROUNDS = {
  NONE: 0,
  GRADIENT_BLUE: 1,
  GRADIENT_RED: 2,
  GRADIENT_GREEN: 3,
  GRADIENT_ORANGE: 4,
  GRADIENT_PURPLE: 5,
  GRADIENT_PINK: 6,
  GRADIENT_YELLOW: 7,
  GRADIENT_TEAL: 8,
  GRADIENT_INDIGO: 9,
  RAINBOW: 10,
};

// Special Background Labels
export const SPECIAL_BACKGROUND_LABELS = {
  [SPECIAL_BACKGROUNDS.NONE]: "Màu thường",
  [SPECIAL_BACKGROUNDS.GRADIENT_BLUE]: "Gradient xanh dương",
  [SPECIAL_BACKGROUNDS.GRADIENT_RED]: "Gradient đỏ",
  [SPECIAL_BACKGROUNDS.GRADIENT_GREEN]: "Gradient xanh lá",
  [SPECIAL_BACKGROUNDS.GRADIENT_ORANGE]: "Gradient cam",
  [SPECIAL_BACKGROUNDS.GRADIENT_PURPLE]: "Gradient tím",
  [SPECIAL_BACKGROUNDS.GRADIENT_PINK]: "Gradient hồng",
  [SPECIAL_BACKGROUNDS.GRADIENT_YELLOW]: "Gradient vàng",
  [SPECIAL_BACKGROUNDS.GRADIENT_TEAL]: "Gradient xanh ngọc",
  [SPECIAL_BACKGROUNDS.GRADIENT_INDIGO]: "Gradient chàm",
  [SPECIAL_BACKGROUNDS.RAINBOW]: "Cầu vồng",
};

// Special Background CSS Classes
export const SPECIAL_BACKGROUND_CLASSES = {
  [SPECIAL_BACKGROUNDS.NONE]: "",
  [SPECIAL_BACKGROUNDS.GRADIENT_BLUE]:
    "bg-gradient-to-r from-blue-400 to-blue-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_RED]:
    "bg-gradient-to-r from-red-400 to-red-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_GREEN]:
    "bg-gradient-to-r from-green-400 to-green-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_ORANGE]:
    "bg-gradient-to-r from-orange-400 to-orange-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_PURPLE]:
    "bg-gradient-to-r from-purple-400 to-purple-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_PINK]:
    "bg-gradient-to-r from-pink-400 to-pink-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_YELLOW]:
    "bg-gradient-to-r from-yellow-400 to-yellow-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_TEAL]:
    "bg-gradient-to-r from-teal-400 to-teal-600",
  [SPECIAL_BACKGROUNDS.GRADIENT_INDIGO]:
    "bg-gradient-to-r from-indigo-400 to-indigo-600",
  [SPECIAL_BACKGROUNDS.RAINBOW]:
    "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500",
};

// Icon Types - 15 icons (10 cho bán hàng + 5 cho công nghệ bếp)
export const LABEL_ICONS = {
  NONE: 0,

  // 10 Icons cho Web Bán Hàng
  HOT: 1, // 🔥 Sản phẩm hot
  NEW: 2, // 🆕 Sản phẩm mới
  SALE: 3, // 🏷️ Giảm giá
  BESTSELLER: 4, // 🏆 Bán chạy nhất
  GIFT: 5, // 🎁 Quà tặng
  PREMIUM: 6, // 💎 Cao cấp
  LIMITED: 7, // ⏰ Có hạn
  FREE_SHIP: 8, // 🚚 Miễn phí vận chuyển
  HEART: 9, // ❤️ Yêu thích
  STAR: 10, // ⭐ Đánh giá cao

  // 5 Icons cho Công Nghệ Điện Lạnh Bếp
  ENERGY_SAVE: 11, // ⚡ Tiết kiệm điện
  SMART: 12, // 🤖 Thông minh
  ECO: 13, // 🌱 Thân thiện môi trường
  WARRANTY: 14, // 🛡️ Bảo hành
  TECH: 15, // 🔧 Công nghệ cao
};

// Icon Labels với emoji và mô tả phù hợp
export const LABEL_ICON_LABELS = {
  [LABEL_ICONS.NONE]: "Không có icon",

  // Icons cho Web Bán Hàng
  [LABEL_ICONS.HOT]: "🔥 Hot",
  [LABEL_ICONS.NEW]: "🆕 Mới",
  [LABEL_ICONS.SALE]: "🏷️ Sale",
  [LABEL_ICONS.BESTSELLER]: "🏆 Bán chạy",
  [LABEL_ICONS.GIFT]: "🎁 Quà tặng",
  [LABEL_ICONS.PREMIUM]: "💎 Cao cấp",
  [LABEL_ICONS.LIMITED]: "⏰ Có hạn",
  [LABEL_ICONS.FREE_SHIP]: "🚚 Freeship",
  [LABEL_ICONS.HEART]: "❤️ Yêu thích",
  [LABEL_ICONS.STAR]: "⭐ Top rated",

  // Icons cho Công Nghệ Điện Lạnh Bếp
  [LABEL_ICONS.ENERGY_SAVE]: "⚡ Tiết kiệm điện",
  [LABEL_ICONS.SMART]: "🤖 Thông minh",
  [LABEL_ICONS.ECO]: "🌱 Eco",
  [LABEL_ICONS.WARRANTY]: "🛡️ Bảo hành",
  [LABEL_ICONS.TECH]: "🔧 Công nghệ cao",
};

// Icon Emojis
export const LABEL_ICON_EMOJIS = {
  [LABEL_ICONS.NONE]: null,

  // Web Bán Hàng
  [LABEL_ICONS.HOT]: "🔥",
  [LABEL_ICONS.NEW]: "🆕",
  [LABEL_ICONS.SALE]: "🏷️",
  [LABEL_ICONS.BESTSELLER]: "🏆",
  [LABEL_ICONS.GIFT]: "🎁",
  [LABEL_ICONS.PREMIUM]: "💎",
  [LABEL_ICONS.LIMITED]: "⏰",
  [LABEL_ICONS.FREE_SHIP]: "🚚",
  [LABEL_ICONS.HEART]: "❤️",
  [LABEL_ICONS.STAR]: "⭐",

  // Công Nghệ Điện Lạnh Bếp
  [LABEL_ICONS.ENERGY_SAVE]: "⚡",
  [LABEL_ICONS.SMART]: "🤖",
  [LABEL_ICONS.ECO]: "🌱",
  [LABEL_ICONS.WARRANTY]: "🛡️",
  [LABEL_ICONS.TECH]: "🔧",
};

// Predefined Colors cho từng loại icon
export const LABEL_COLOR_PRESETS = {
  // Basic Colors
  BLUE: "#3498db",
  RED: "#e74c3c",
  GREEN: "#2ecc71",
  ORANGE: "#f39c12",
  PURPLE: "#9b59b6",
  TEAL: "#1abc9c",
  YELLOW: "#f1c40f",
  DARK_GRAY: "#34495e",
  DARK_ORANGE: "#e67e22",
  DARK_PURPLE: "#8e44ad",
};

// Recommended colors cho từng icon type
export const ICON_RECOMMENDED_COLORS = {
  // Web Bán Hàng
  [LABEL_ICONS.HOT]: LABEL_COLOR_PRESETS.RED, // Đỏ cho "hot"
  [LABEL_ICONS.NEW]: LABEL_COLOR_PRESETS.GREEN, // Xanh cho "mới"
  [LABEL_ICONS.SALE]: LABEL_COLOR_PRESETS.ORANGE, // Cam cho "sale"
  [LABEL_ICONS.BESTSELLER]: LABEL_COLOR_PRESETS.YELLOW, // Vàng cho "bán chạy"
  [LABEL_ICONS.GIFT]: LABEL_COLOR_PRESETS.PURPLE, // Tím cho "quà tặng"
  [LABEL_ICONS.PREMIUM]: LABEL_COLOR_PRESETS.DARK_PURPLE, // Tím đậm cho "cao cấp"
  [LABEL_ICONS.LIMITED]: LABEL_COLOR_PRESETS.DARK_ORANGE, // Cam đậm cho "có hạn"
  [LABEL_ICONS.FREE_SHIP]: LABEL_COLOR_PRESETS.TEAL, // Xanh ngọc cho "freeship"
  [LABEL_ICONS.HEART]: LABEL_COLOR_PRESETS.RED, // Đỏ cho "yêu thích"
  [LABEL_ICONS.STAR]: LABEL_COLOR_PRESETS.YELLOW, // Vàng cho "đánh giá cao"

  // Công Nghệ Điện Lạnh Bếp
  [LABEL_ICONS.ENERGY_SAVE]: LABEL_COLOR_PRESETS.GREEN, // Xanh cho "tiết kiệm điện"
  [LABEL_ICONS.SMART]: LABEL_COLOR_PRESETS.BLUE, // Xanh dương cho "thông minh"
  [LABEL_ICONS.ECO]: LABEL_COLOR_PRESETS.GREEN, // Xanh cho "eco"
  [LABEL_ICONS.WARRANTY]: LABEL_COLOR_PRESETS.DARK_GRAY, // Xám đậm cho "bảo hành"
  [LABEL_ICONS.TECH]: LABEL_COLOR_PRESETS.BLUE, // Xanh dương cho "công nghệ"
};

// Utility Functions
export const getLabelIcon = (iconType) => {
  // Kiểm tra nếu iconType là undefined hoặc null
  if (iconType === undefined || iconType === null) {
    return null;
  }
  return LABEL_ICON_EMOJIS[iconType] || null;
};

export const getLabelIconLabel = (iconType) => {
  if (iconType === undefined || iconType === null) {
    return "Không có icon";
  }
  return LABEL_ICON_LABELS[iconType] || "Không có icon";
};

export const getRecommendedColor = (iconType) => {
  if (iconType === undefined || iconType === null) {
    return LABEL_COLOR_PRESETS.BLUE;
  }
  return ICON_RECOMMENDED_COLORS[iconType] || LABEL_COLOR_PRESETS.BLUE;
};

export const getSpecialBackgroundClass = (backgroundType) => {
  // Kiểm tra nếu backgroundType là undefined hoặc null
  if (backgroundType === undefined || backgroundType === null) {
    return "";
  }
  return SPECIAL_BACKGROUND_CLASSES[backgroundType] || "";
};

export const getSpecialBackgroundLabel = (backgroundType) => {
  if (backgroundType === undefined || backgroundType === null) {
    return "Màu thường";
  }
  return SPECIAL_BACKGROUND_LABELS[backgroundType] || "Màu thường";
};

// Get options for dropdowns
export const getIconOptions = () => {
  return Object.entries(LABEL_ICONS).map(([key, value]) => ({
    value: value,
    label: LABEL_ICON_LABELS[value],
    emoji: LABEL_ICON_EMOJIS[value],
    recommendedColor: ICON_RECOMMENDED_COLORS[value],
  }));
};

export const getSpecialBackgroundOptions = () => {
  return Object.entries(SPECIAL_BACKGROUNDS).map(([key, value]) => ({
    value: value,
    label: SPECIAL_BACKGROUND_LABELS[value],
    className: SPECIAL_BACKGROUND_CLASSES[value],
  }));
};

// Quick preset functions
export const createQuickLabel = (iconType, name) => {
  return {
    name: name,
    icon: iconType || LABEL_ICONS.NONE,
    colorBg: getRecommendedColor(iconType),
    colorText: "#ffffff",
    specialBackground: SPECIAL_BACKGROUNDS.NONE,
  };
};

// Common label presets cho Bepanphu
export const KITCHEN_CARE_PRESETS = [
  createQuickLabel(LABEL_ICONS.HOT, "Sản phẩm hot"),
  createQuickLabel(LABEL_ICONS.NEW, "Hàng mới về"),
  createQuickLabel(LABEL_ICONS.SALE, "Giảm giá"),
  createQuickLabel(LABEL_ICONS.BESTSELLER, "Bán chạy nhất"),
  createQuickLabel(LABEL_ICONS.ENERGY_SAVE, "Tiết kiệm điện"),
  createQuickLabel(LABEL_ICONS.SMART, "Thông minh"),
  createQuickLabel(LABEL_ICONS.ECO, "Thân thiện môi trường"),
  createQuickLabel(LABEL_ICONS.WARRANTY, "Bảo hành chính hãng"),
  createQuickLabel(LABEL_ICONS.PREMIUM, "Cao cấp"),
  createQuickLabel(LABEL_ICONS.FREE_SHIP, "Miễn phí vận chuyển"),
];

// Enhanced Label Component Helper - Updated theo model mới
export const buildLabelStyle = (label) => {
  // Kiểm tra label object
  if (!label) {
    return {
      className: "",
      style: {
        backgroundColor: "#f3f4f6",
        color: "#000000",
      },
    };
  }

  // Kiểm tra special background
  const hasSpecialBackground =
    label.specialBackground !== undefined &&
    label.specialBackground !== null &&
    label.specialBackground !== SPECIAL_BACKGROUNDS.NONE;

  if (hasSpecialBackground) {
    return {
      className: getSpecialBackgroundClass(label.specialBackground),
      style: {
        color: label.colorText || "#ffffff",
      },
    };
  }

  // Return normal style với fallback values
  return {
    className: "",
    style: {
      backgroundColor: label.colorBg || "#3498db",
      color: label.colorText || "#ffffff",
    },
  };
};

// Validation functions theo model mới
export const validateLabel = (labelData) => {
  const errors = [];

  // Required fields
  if (!labelData.name || labelData.name.trim() === "") {
    errors.push("Tên nhãn là bắt buộc");
  }

  // Validate colors
  if (labelData.colorBg && !isValidColor(labelData.colorBg)) {
    errors.push("Màu nền không hợp lệ");
  }

  if (labelData.colorText && !isValidColor(labelData.colorText)) {
    errors.push("Màu chữ không hợp lệ");
  }

  // Validate icon
  if (labelData.icon !== undefined && labelData.icon !== null) {
    if (!Object.values(LABEL_ICONS).includes(labelData.icon)) {
      errors.push("Icon không hợp lệ");
    }
  }

  // Validate special background
  if (
    labelData.specialBackground !== undefined &&
    labelData.specialBackground !== null
  ) {
    if (
      !Object.values(SPECIAL_BACKGROUNDS).includes(labelData.specialBackground)
    ) {
      errors.push("Special background không hợp lệ");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

// Helper function to validate hex color
const isValidColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Create label data theo format model mới
export const createLabelData = (formData) => {
  const labelData = {
    name: formData.name.trim(),
    colorBg: formData.colorBg || "#3498db",
    colorText: formData.colorText || "#ffffff",
  };

  // Chỉ thêm icon nếu không phải NONE
  if (formData.icon && formData.icon !== LABEL_ICONS.NONE) {
    labelData.icon = formData.icon;
  }

  // Chỉ thêm specialBackground nếu không phải NONE
  if (
    formData.specialBackground &&
    formData.specialBackground !== SPECIAL_BACKGROUNDS.NONE
  ) {
    labelData.specialBackground = formData.specialBackground;
  }

  return labelData;
};

// Icon category helpers
export const getEcommerceIcons = () => {
  return Object.entries(LABEL_ICONS)
    .filter(([key, value]) => value >= 1 && value <= 10)
    .map(([key, value]) => ({
      value,
      label: LABEL_ICON_LABELS[value],
      emoji: LABEL_ICON_EMOJIS[value],
    }));
};

export const getTechIcons = () => {
  return Object.entries(LABEL_ICONS)
    .filter(([key, value]) => value >= 11 && value <= 15)
    .map(([key, value]) => ({
      value,
      label: LABEL_ICON_LABELS[value],
      emoji: LABEL_ICON_EMOJIS[value],
    }));
};

// Default values theo model schema
export const DEFAULT_LABEL_VALUES = {
  name: "",
  colorBg: "#3498db",
  colorText: "#ffffff",
  icon: LABEL_ICONS.NONE,
  specialBackground: SPECIAL_BACKGROUNDS.NONE,
};

// Format label object cho API request
export const formatLabelForAPI = (label) => {
  const formatted = {
    name: label.name,
    colorBg: label.colorBg,
    colorText: label.colorText,
  };

  // Chỉ gửi icon nếu có và khác NONE
  if (
    label.icon !== undefined &&
    label.icon !== null &&
    label.icon !== LABEL_ICONS.NONE
  ) {
    formatted.icon = label.icon;
  }

  // Chỉ gửi specialBackground nếu có và khác NONE
  if (
    label.specialBackground !== undefined &&
    label.specialBackground !== null &&
    label.specialBackground !== SPECIAL_BACKGROUNDS.NONE
  ) {
    formatted.specialBackground = label.specialBackground;
  }

  return formatted;
};
