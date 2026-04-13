export type Mood = "great" | "good" | "okay" | "bad";

export interface Entry {
  id: string;
  date: string;
  mood: Mood;
  waterIntake: number;
  sleepHours: number;
  exerciseMinutes: number;
  notes?: string;

  createdAt: string;
  updatedAt: string;
}
