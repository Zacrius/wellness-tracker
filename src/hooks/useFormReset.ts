import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { UseFormReset } from "react-hook-form";
import type { Mood } from "@/types/entry";

interface EntryFormValues {
  mood: Mood;
  waterIntake: number;
  sleepHours: number;
  exerciseMinutes: number;
  notes: string;
  date: Date;
}

export const useFormReset = (
  entryId: string | undefined,
  reset: UseFormReset<EntryFormValues>,
  setSelectedDate: (date: Date) => void,
) => {
  useFocusEffect(
    useCallback(() => {
      if (!entryId) {
        const now = new Date();
        setSelectedDate(now);
        reset({
          mood: "okay",
          waterIntake: 0,
          sleepHours: 0,
          exerciseMinutes: 0,
          notes: "",
          date: now,
        });
      }
    }, [entryId, reset, setSelectedDate]),
  );
};
