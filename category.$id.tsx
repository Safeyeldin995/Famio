import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Profile {
  name: string;
  phone: string;
  address: string;
  apartment: string;
  building: string;
  compound: string;
  notes: string;
  avatar?: string;
}

interface AppState {
  onboarded: boolean;
  authed: boolean;
  profile: Profile;
  favorites: string[];
  setOnboarded: (v: boolean) => void;
  setAuthed: (v: boolean) => void;
  setProfile: (p: Partial<Profile>) => void;
  toggleFavorite: (id: string) => void;
  reset: () => void;
}

const emptyProfile: Profile = {
  name: "",
  phone: "",
  address: "",
  apartment: "",
  building: "",
  compound: "",
  notes: "",
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      onboarded: false,
      authed: false,
      profile: emptyProfile,
      favorites: ["p1", "k1"],
      setOnboarded: (v) => set({ onboarded: v }),
      setAuthed: (v) => set({ authed: v }),
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      reset: () => set({ onboarded: false, authed: false, profile: emptyProfile, favorites: [] }),
    }),
    { name: "famio-app" }
  )
);
