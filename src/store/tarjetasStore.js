import { create } from "zustand";

export const useTarjetasStore = create((set) => ({
  tarjetas: [],
  filtros: {
    search: "",
    estado: "",
    fechaOrden: "",
  },
  loading: false,
  error: null,

  setTarjetas: (tarjetas) => set({ tarjetas }),

  addTarjeta: (tarjeta) =>
    set((state) => ({
      tarjetas: [...state.tarjetas, tarjeta],
    })),

  updateTarjeta: (id, updatedData) =>
    set((state) => ({
      tarjetas: state.tarjetas.map((t) =>
        t.id === id ? { ...t, ...updatedData } : t
      ),
    })),

  deleteTarjeta: (id) =>
    set((state) => ({
      tarjetas: state.tarjetas.filter((t) => t.id !== id),
    })),

  setFiltros: (filtros) =>
    set((state) => ({
      filtros: { ...state.filtros, ...filtros },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
