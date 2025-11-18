import React from "react";
import {
  getLabelIcon,
  buildLabelStyle,
  SPECIAL_BACKGROUNDS,
} from "@/components/ConstantLabel/ConstantLabel";

const EnhancedLabel = ({ label }) => {
  if (!label) return null;

  const { className, style } = buildLabelStyle(label);
  const icon = getLabelIcon(label.icon);

  // Kiểm tra special background với null safety
  const hasSpecialBackground =
    label.specialBackground !== undefined &&
    label.specialBackground !== null &&
    label.specialBackground !== SPECIAL_BACKGROUNDS.NONE;

  return (
    <span
      className={`text-xs mb-1 max-sm:text-[10px] rounded-full px-2 py-1 font-medium inline-flex items-center gap-1 ${className}`}
      style={style}
    >
      {icon && <span className="text-xs">{icon}</span>}
      <span className="truncate">{label.name}</span>
      {hasSpecialBackground && (
        <span className="ml-0.5 opacity-80 text-[10px]">✨</span>
      )}
    </span>
  );
};

export default EnhancedLabel;
