// /stores/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: string | null;
  setToken: (token: string) => void;
  setUserId: (userId: string) => void;
  clearToken: () => void;
  clearUserId: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  setToken: (token) => set({ token }),
  setUserId: (userId) => set({ userId }),
  clearToken: () => set({ token: null }),
  clearUserId: () => set({ userId: null }),
}));

export default useAuthStore;
