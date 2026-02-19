import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  authInitialized: boolean; // 초기화 여부 추가

  setAccessToken: (token: string) => void;
  logout: () => void;
  setAuthInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  authInitialized: false,
  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: true,
    }),

  setAuthInitialized: (initialized) =>
    set({
      authInitialized: initialized,
    }),

  logout: () =>
    set({
      accessToken: null,
      isAuthenticated: false,
    }),
}));
