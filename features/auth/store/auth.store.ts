import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  authInitialized: boolean;

  setAccessToken: (token: string | null) => void;
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
