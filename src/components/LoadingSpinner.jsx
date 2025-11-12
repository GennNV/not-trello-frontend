import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
