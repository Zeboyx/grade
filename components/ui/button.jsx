"use client";
export function Button({ children, onClick, className = "", variant = "outline" }) {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700"
  };
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}