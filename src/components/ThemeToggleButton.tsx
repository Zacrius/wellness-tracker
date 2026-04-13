import { Moon, Sun } from "lucide-react-native";
import { useThemeStore } from "@/store/themeStore";
import HeaderActionButton from "@/components/HeaderActionButton";

export default function ThemeToggleButton() {
  const themePref = useThemeStore((s) => s.preference);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const isDarkSelected = themePref === "dark";

  return (
    <HeaderActionButton
      accessibilityLabel="Toggle dark mode"
      onPress={toggleTheme}
      icon={
        isDarkSelected ? (
          <Sun size={18} color="#ffffff" />
        ) : (
          <Moon size={18} color="#ffffff" />
        )
      }
      label={isDarkSelected ? "Light" : "Dark"}
    />
  );
}

