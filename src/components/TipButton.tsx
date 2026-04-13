import { Lightbulb } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import HeaderActionButton from "@/components/HeaderActionButton";

export default function TipButton() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <HeaderActionButton
      accessibilityLabel="Open tip of the day"
      onPress={() => navigation.navigate("TipModal")}
      icon={<Lightbulb size={18} color="#ffffff" />}
      label="Tip"
    />
  );
}

