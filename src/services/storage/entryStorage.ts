import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Entry } from "@/types/entry";

const STORAGE_KEY = "entries";

export const saveEntries = async (entries: Entry[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Error saving entries", error);
  }
};

export const loadEntries = async (): Promise<Entry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading entries", error);
    return [];
  }
};
