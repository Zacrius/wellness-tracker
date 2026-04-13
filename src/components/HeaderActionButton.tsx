import { Pressable, Text, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

type Props = {
  accessibilityLabel: string;
  onPress: () => void;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function HeaderActionButton({
  accessibilityLabel,
  onPress,
  icon,
  label,
  disabled,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      className="bg-white/15 px-4 py-2 rounded-full flex-row items-center gap-2"
      style={style}
    >
      {icon}
      <Text className="text-white font-semibold">{label}</Text>
    </Pressable>
  );
}

