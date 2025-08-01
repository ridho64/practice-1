// 📁 Place this in: src/components/CategoryNav.js

"use client";
import React from "react";

export default function CategoryNav({ categories, active, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
            ${
              active === category
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-blue-500 border-blue-300 hover:bg-blue-100"
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
