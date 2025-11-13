import React, { useState, useEffect } from "react";
import { X, ImageIcon } from "lucide-react";
import { useBackgroundStore } from "../store/backgroundStore";

const BackgroundModal = ({ isOpen, onClose }) => {
  const [images, setImages] = useState([]);
  const { backgroundImage, setBackground, clearBackground } = useBackgroundStore();

  useEffect(() => {
    // Cargar lista de imágenes de la carpeta bg-images
    const loadImages = async () => {
      try {
        // Lista de imágenes disponibles
        const imageFiles = [
          "bg (1).jpg",
          "bg (2).jpg",
          "bg (3).jpg",
          "bg (4).jpg",
          "bg (5).jpg",
          "bg (6).jpg",
          "bg (7).jpg",
          "bg (8).jpg",
        ];
        
        const imagePaths = imageFiles.map(file => `/bg-images/${file}`);
        setImages(imagePaths);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageClick = (imagePath) => {
    setBackground(imagePath);
  };

  const handleClearBackground = () => {
    clearBackground();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Personalizar Fondo
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Selecciona una imagen para tu espacio de trabajo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Grid de imágenes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((imagePath, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(imagePath)}
                className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                  backgroundImage === imagePath
                    ? "ring-2 ring-blue-500 scale-105 shadow-lg"
                    : "hover:scale-105 hover:shadow-md"
                }`}
              >
                <img
                  src={imagePath}
                  alt={`Fondo ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                {backgroundImage === imagePath && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No se encontraron imágenes</p>
            </div>
          )}

          {/* Botón para quitar fondo */}
          {images.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClearBackground}
                className={`w-full py-2.5 px-4 rounded-lg transition-all font-medium ${
                  backgroundImage
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  <span>Quitar Fondo</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundModal;
