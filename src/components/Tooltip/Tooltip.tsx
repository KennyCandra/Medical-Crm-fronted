import { useState } from "react";

export function Tooltip({ content, children }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!content) return children;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[900]">
          {content}
        </div>
      )}
    </div>
  );
}
