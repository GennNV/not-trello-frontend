import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBackgroundStore = create(
  persist(
    (set) => ({
      backgroundImage: null,
      setBackgroundImage: (image) => set({ backgroundImage: image }),
      clearBackground: () => set({ backgroundImage: null }),
    }),
    {
      name: "background-storage",
    }
  )
);
