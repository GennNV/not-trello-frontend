import React from "react";
import { X } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const Modal = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useThemeStore();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm transition-opacity"
        style={{
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: darkMode ? 'rgb(31, 41, 55)' : 'white'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{
            borderColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)'
          }}
        >
          <h2 className="text-xl font-bold" style={{ color: darkMode ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition"
            style={{
              color: darkMode ? 'rgb(156, 163, 175)' : 'rgb(156, 163, 175)'
            }}
            onMouseEnter={(e) => e.target.style.color = darkMode ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'}
            onMouseLeave={(e) => e.target.style.color = 'rgb(156, 163, 175)'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
