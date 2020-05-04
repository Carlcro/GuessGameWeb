import React from "react";

export default function Button({ className = "", onClick, children }) {
  return (
    <button
      className={`bg-button text-buttonText p-3 mt-3 w-48 rounded ${className} `}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
