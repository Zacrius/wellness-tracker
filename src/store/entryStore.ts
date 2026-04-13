import { create } from "zustand";
import type { Entry } from "@/types/entry";

type EntryState = {
  entries: Entry[];

  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, updated: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;

  setEntries: (entries: Entry[]) => void;
};

export const useEntryStore = create<EntryState>((set) => ({
  entries: [],

  setEntries: (entries) => set({ entries }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [entry, ...state.entries],
    })),

  updateEntry: (id, updated) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id
          ? { ...entry, ...updated, updatedAt: new Date().toISOString() }
          : entry,
      ),
    })),

  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
}));
