import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBackgroundStore = create(
  persist(
    (set) => ({
      backgroundImage: null,

      setBackground: (imagePath) => {
        set({ backgroundImage: imagePath });
      },

      clearBackground: () => {
        set({ backgroundImage: null });
      },

      initBackground: () => {
        // La inicialización se maneja en el componente
      },
    }),
    {
      name: "background-storage",
    }
  )
);
