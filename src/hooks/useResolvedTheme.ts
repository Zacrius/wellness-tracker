import { useColorScheme } from "react-native";
import { useThemeStore } from "@/store/themeStore";

export const useResolvedTheme = () => {
  const system = useColorScheme();
  const preference = useThemeStore((s) => s.preference);

  const resolved = preference === "system" ? system ?? "light" : preference;
  return {
    preference,
    resolved,
    isDark: resolved === "dark",
  };
};

