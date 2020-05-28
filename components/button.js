import React from "react";

export default function Button({
  className = "",
  onClick,
  disabled = false,
  children,
  type = "button",
}) {
  return (
    <button
      className={`bg-button text-buttonText p-2 mt-3 w-48 rounded ${className} `}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
