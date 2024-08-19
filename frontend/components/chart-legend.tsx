import React from "react";

interface CustomLegendProps {
  dataKeys: string[];
  colors: string[];
  visibleKeys: string[];
  toggleKey: (key: string) => void;
  customLabels?: { [key: string]: string };
}

export const CustomLegend: React.FC<CustomLegendProps> = ({
  dataKeys,
  colors,
  visibleKeys,
  toggleKey,
  customLabels,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mt-4">
      {dataKeys.map((key, index) => (
        <button
          key={key}
          onClick={() => toggleKey(key)}
          className={`text-sm font-medium leading-none cursor-pointer select-none ${
            visibleKeys.includes(key) ? "" : "opacity-50"
          }`}
          style={{ color: colors[index % colors.length] }}
        >
          {customLabels?.[key] || key}
        </button>
      ))}
    </div>
  );
};
