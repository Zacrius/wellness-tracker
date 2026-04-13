import { useEffect } from "react";
import { useEntryStore } from "@/store/entryStore";
import { saveEntries } from "@/services/storage/entryStorage";

export const usePersistEntries = () => {
  const entries = useEntryStore((s) => s.entries);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);
};
