import { useEffect } from "react";
import { useEntryStore } from "@/store/entryStore";
import { loadEntries } from "@/services/storage/entryStorage";

export const useInitializeEntries = () => {
  const setEntries = useEntryStore((s) => s.setEntries);

  useEffect(() => {
    const init = async () => {
      const entries = await loadEntries();
      setEntries(entries);
    };

    init();
  }, [setEntries]);
};
