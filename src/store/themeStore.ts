import { create } from "zustand";

export type ThemePreference = "system" | "light" | "dark";

type ThemeState = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: "system",
  setPreference: (preference) => set({ preference }),
  toggle: () => {
    const current = get().preference;
    // Simple UX: toggles between explicit light/dark (system is initial default)
    if (current === "dark") set({ preference: "light" });
    else set({ preference: "dark" });
  },
}));

