import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useEntryStore } from "@/store/entryStore";
import { useHealthTipsPaginated } from "@/hooks/useHealthTips";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import TipButton from "@/components/TipButton";
import {
  Droplets,
  Dumbbell,
  Activity,
  Calendar,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Laugh,
  Moon,
  Lightbulb,
} from "lucide-react-native";

export default function DashboardScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useResolvedTheme();
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHealthTipsPaginated();

  const entries = useEntryStore((s) => s.entries);

  const allTips = data?.pages.flatMap((page) => page.tips) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const totalEntries = entries.length;
  const totalWater = entries.reduce((sum, e) => sum + (e.waterIntake || 0), 0);
  const avgSleep =
    entries.length > 0
      ? (
          entries.reduce((sum, e) => sum + (e.sleepHours || 0), 0) /
          entries.length
        ).toFixed(1)
      : "0";
  const avgExercise =
    entries.length > 0
      ? (
          entries.reduce((sum, e) => sum + (e.exerciseMinutes || 0), 0) /
          entries.length
        ).toFixed(0)
      : "0";
  const latestMood = entries[0]?.mood || "—";

  const getMoodIcon = (mood: string, size: number = 40) => {
    switch (mood) {
      case "great":
        return <Laugh size={size} color="#FFD700" />;
      case "good":
        return <Smile size={size} color="#4CAF50" />;
      case "okay":
        return <Meh size={size} color="#FF9800" />;
      case "bad":
        return <Frown size={size} color="#F44336" />;
      default:
        return <Activity size={size} color="#9ca3af" />;
    }
  };

  if (entries.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-950 items-center justify-center p-6">
        <Activity size={48} color="#9ca3af" />
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center mt-4 mb-2">
          No Data Yet
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          Start logging your health entries to see insights and track your
          progress!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor="#667eea"
        />
      }
    >
      <LinearGradient
        colors={isDark ? ["#020617", "#0b1220"] : ["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-8 px-5 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-3xl font-bold mb-2">
              Dashboard
            </Text>
            <Text className="text-white/80 text-base">
              Track your wellness journey
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <ThemeToggleButton />
            <TipButton />
          </View>
        </View>
      </LinearGradient>

      <View className="px-5 mt-6">
        <View className="flex-row gap-4 mb-4">
          <View
            className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <TrendingUp size={24} color="#667eea" />
            <Text className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Total Entries
            </Text>
            <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {totalEntries}
            </Text>
          </View>

          <View
            className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Droplets size={24} color="#3b82f6" />
            <Text className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Water Intake
            </Text>
            <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {totalWater} ml
            </Text>
          </View>
        </View>

        <View className="flex-row gap-4 mb-4">
          <View
            className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Moon size={24} color="#8b5cf6" />
            <Text className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Avg Sleep
            </Text>
            <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {avgSleep} hrs
            </Text>
          </View>

          <View
            className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Dumbbell size={24} color="#10b981" />
            <Text className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Avg Exercise
            </Text>
            <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {avgExercise} min
            </Text>
          </View>
        </View>

        <View
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-6 flex-row items-center justify-between"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View>
            <Text className="text-gray-600 dark:text-gray-300 text-sm mb-1">
              Latest Mood
            </Text>
            <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
              {latestMood}
            </Text>
          </View>
          {getMoodIcon(latestMood, 40)}
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Recent Activity
          </Text>
          {entries.slice(0, 5).map((entry, index) => (
            <View
              key={entry.id}
              className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${index !== 4 ? "mb-3" : ""}`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center gap-1">
                  <Calendar size={14} color="#9ca3af" />
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </View>
                {getMoodIcon(entry.mood, 24)}
              </View>
              <View className="flex-row gap-4">
                {entry.waterIntake > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Droplets size={14} color="#3b82f6" />
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.waterIntake}ml
                    </Text>
                  </View>
                )}
                {entry.sleepHours > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Moon size={14} color="#8b5cf6" />
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.sleepHours}h
                    </Text>
                  </View>
                )}
                {entry.exerciseMinutes > 0 && (
                  <View className="flex-row items-center gap-1">
                    <Dumbbell size={14} color="#10b981" />
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.exerciseMinutes}min
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Health Tips Section with Load More */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Lightbulb size={20} color="#f59e0b" />
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Health Tips
              </Text>
            </View>
            {totalCount > 0 && (
              <Text className="text-xs text-gray-400">
                {allTips.length} of {totalCount}
              </Text>
            )}
          </View>

          {isLoading && (
            <View
              className="bg-white dark:bg-gray-900 rounded-xl p-8 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <ActivityIndicator size="small" color="#667eea" />
              <Text className="text-gray-500 dark:text-gray-400 mt-3">
                Loading tips...
              </Text>
            </View>
          )}

          {isError && (
            <View
              className="bg-white dark:bg-gray-900 rounded-xl p-6 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-red-500 text-center mb-3">
                Failed to load tips
              </Text>
              <Text
                onPress={() => refetch()}
                className="text-indigo-500 font-semibold"
              >
                Tap to retry
              </Text>
            </View>
          )}

          {allTips.map((tip, index) => (
            <View
              key={tip.id}
              className={`bg-white dark:bg-gray-900 rounded-xl p-4 ${index !== allTips.length - 1 ? "mb-3" : ""}`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-gray-700 dark:text-gray-200 leading-5">
                {tip.text}
              </Text>
              {tip.source && (
                <Text className="text-gray-400 text-xs mt-2">
                  Source: {tip.source}
                </Text>
              )}
            </View>
          ))}

          {hasNextPage && (
            <Pressable
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-indigo-50 dark:bg-indigo-950/40 py-3 rounded-xl items-center mt-3"
              style={{
                opacity: isFetchingNextPage ? 0.7 : 1,
              }}
            >
              {isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#667eea" />
              ) : (
                <Text className="text-indigo-600 dark:text-indigo-300 font-semibold">
                  Load More Tips
                </Text>
              )}
            </Pressable>
          )}

          {!hasNextPage && allTips.length > 0 && (
            <Text className="text-gray-400 text-center text-sm mt-4">
              You've seen all {totalCount} health tips
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
