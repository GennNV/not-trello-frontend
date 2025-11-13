import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDark: false,

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      
      if (newIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      
      return { isDark: newIsDark };
    });
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    
    set({ isDark });
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
}));
