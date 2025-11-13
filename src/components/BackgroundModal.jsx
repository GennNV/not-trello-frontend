import React from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { useBackgroundStore } from "../store/backgroundStore";
import toast from "react-hot-toast";

const BackgroundModal = ({ isOpen, onClose }) => {
  const { backgroundImage, setBackgroundImage, clearBackground } = useBackgroundStore();

  const backgrounds = [
    { id: 1, name: "Fondo 1" },
    { id: 2, name: "Fondo 2" },
    { id: 3, name: "Fondo 3" },
    { id: 4, name: "Fondo 4" },
    { id: 5, name: "Fondo 5" },
    { id: 6, name: "Fondo 6" },
    { id: 7, name: "Fondo 7" },
    { id: 8, name: "Fondo 8" },
  ];

  const handleSelectBackground = (bg) => {
    const imgSrc = `/bg-images/bg_(${bg.id}).jpg`;
    setBackgroundImage(imgSrc);
    toast.success(`Fondo ${bg.id} aplicado`);
    onClose();
  };

  const handleClearBackground = () => {
    clearBackground();
    toast.success("Fondo eliminado");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Cambiar Fondo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {backgrounds.map((bg) => {
              const imgSrc = `/bg-images/bg_(${bg.id}).jpg`;
              const isActive = backgroundImage === imgSrc;
              
              return (
                <div
                  key={bg.id}
                  onClick={() => handleSelectBackground(bg)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all hover:scale-105 ${
                    isActive
                      ? "border-blue-600 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={bg.name}
                    className="w-full h-32 object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Activo
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleClearBackground}
            className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold"
          >
            Sin Fondo
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundModal;
