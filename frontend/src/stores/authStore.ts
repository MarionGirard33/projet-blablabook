import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserProps {
  id: number;
  image: string | null;
  email: string;
  username: string;
  roles: string;
}

interface AuthStoreProps {
  user: UserProps | null;
  isAuthenticated: boolean;

  login: (user: UserProps) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProps>) => void;
}

export const useAuthStore = create<AuthStoreProps>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        }));
      },
    }),
    {
      name: "auth_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
