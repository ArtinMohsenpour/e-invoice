import { create } from "zustand";
import { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  signOut: () => set({ profile: null }),
}));
