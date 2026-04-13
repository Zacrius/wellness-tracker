import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useTipOfTheDay } from "@/hooks/useTipOfTheDay";
import { LinearGradient } from "expo-linear-gradient";
import { X, Lightbulb } from "lucide-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

type Props = NativeStackScreenProps<RootStackParamList, "TipModal">;

export default function TipModalScreen({ navigation }: Props) {
  const { data, isLoading, isError, refetch, isRefetching } = useTipOfTheDay();
  const { isDark } = useResolvedTheme();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950 mt-5">
      <LinearGradient
        colors={isDark ? ["#020617", "#0b1220"] : ["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-5 px-5 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between px-5">
          <View className="flex-row items-center gap-2">
            <Lightbulb size={22} color="#fbbf24" />
            <Text className="text-white text-xl font-semibold">
              Tip of the Day
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
          >
            <X size={22} color="#ffffff" />
          </Pressable>
        </View>
      </LinearGradient>

      <View className="p-5">
        {isLoading && (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 items-center">
            <ActivityIndicator size="small" color="#667eea" />
            <Text className="text-gray-500 dark:text-gray-400 mt-3">
              Loading tip…
            </Text>
          </View>
        )}

        {isError && (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 items-center">
            <Text className="text-red-500 text-center mb-3">
              Couldn't load a tip.
            </Text>
            <Pressable
              onPress={() => refetch()}
              disabled={isRefetching}
              className="bg-indigo-50 dark:bg-indigo-950/40 py-3 px-6 rounded-xl"
              style={{ opacity: isRefetching ? 0.7 : 1 }}
            >
              <Text className="text-indigo-600 dark:text-indigo-300 font-semibold">
                Retry
              </Text>
            </Pressable>
          </View>
        )}

        {!isLoading && !isError && data && (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6">
            <Text className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-2">
              {data.category.toUpperCase()}
            </Text>
            <Text className="text-gray-700 dark:text-gray-200 leading-6">
              {data.text}
            </Text>
            {!!data.source && (
              <Text className="text-gray-400 text-xs mt-4">
                Source: {data.source}
              </Text>
            )}
          </View>
        )}

        {!isLoading && !isError && !data && (
          <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 items-center">
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              No tip available right now.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
