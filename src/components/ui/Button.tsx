import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  varient?: string;
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  varient,
  loading,
}: ButtonProps) {
  const varients = [
    {
      name: "primary",
      className:
        "bg-purple-700 text-white rounded-[10px] shadow text-sm py-2 px-3 transition-all hover:bg-purple-700/80 cursor-pointer",
    },
    {
      name: "secondary",
      className:
        "text-black rounded-[10px] text-sm py-2 px-3 transition-all hover:bg-gray-100 cursor-pointer",
    },
  ];

  const isVarient = varients.find((item) => item.name === varient);

  return (
    <button
      onClick={onClick}
      className={`${isVarient ? isVarient.className : varients[0].className}`}
    >
      {loading ? <div className="animate-pulse">loading..</div> : children}
    </button>
  );
}
