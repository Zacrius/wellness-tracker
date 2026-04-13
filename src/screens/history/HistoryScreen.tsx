import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useState } from "react";
import { useEntryStore } from "@/store/entryStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { RectButton } from "react-native-gesture-handler";
import { loadEntries } from "@/services/storage/entryStorage";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import TipButton from "@/components/TipButton";
import {
  Droplets,
  Moon,
  Dumbbell,
  Calendar,
  ChevronRight,
  Inbox,
  Smile,
  Frown,
  Meh,
  Laugh,
  Trash2,
} from "lucide-react-native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EntryDetail"
>;

const ITEMS_PER_PAGE = 10;

const getMoodIcon = (mood: string, size: number = 24) => {
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
      return <Smile size={size} color="#9ca3af" />;
  }
};

export default function HistoryScreen() {
  const { isDark } = useResolvedTheme();
  const entries = useEntryStore((s) => s.entries);
  const setEntries = useEntryStore((s) => s.setEntries);
  const deleteEntry = useEntryStore((s) => s.deleteEntry);
  const navigation = useNavigation<NavigationProp>();

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const visibleEntries = sortedEntries.slice(0, visibleCount);
  const hasMore = visibleCount < sortedEntries.length;

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      const fresh = await loadEntries();
      setEntries(fresh);
      setVisibleCount(ITEMS_PER_PAGE);
    } finally {
      setIsRefreshing(false);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Entry", "Delete this entry permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteEntry(id) },
    ]);
  };

  const loadMore = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    // Simulate async load for smooth UX
    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, sortedEntries.length),
      );
      setIsLoadingMore(false);
    }, 500);
  };

  const renderFooter = () => {
    if (!hasMore) {
      if (sortedEntries.length === 0) return null;
      return (
        <View className="py-6 items-center">
          <Text className="text-gray-400 text-sm">You've seen all entries</Text>
        </View>
      );
    }

    return (
      <View className="py-4 items-center">
        {isLoadingMore ? (
          <ActivityIndicator size="small" color="#667eea" />
        ) : (
          <TouchableOpacity
            onPress={loadMore}
            className="bg-indigo-50 dark:bg-indigo-950/40 py-3 px-6 rounded-xl"
          >
            <Text className="text-indigo-600 dark:text-indigo-300 font-semibold">
              Load More
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <LinearGradient
        colors={isDark ? ["#020617", "#0b1220"] : ["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-5 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-3xl font-bold mb-1">History</Text>
            <Text className="text-white/80 text-base">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
              logged
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <ThemeToggleButton />
            <TipButton />
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={visibleEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#667eea"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Inbox size={48} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-4">
              No entries yet
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Start logging your health journey!
            </Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <Swipeable
            overshootRight={false}
            renderRightActions={() => (
              <RectButton
                onPress={() => confirmDelete(item.id)}
                style={{ borderRadius: 16, marginBottom: 12 }}
              >
                <View className="h-full bg-red-500 rounded-2xl px-5 items-center justify-center flex-row gap-2">
                  <Trash2 size={18} color="#ffffff" />
                  <Text className="text-white font-semibold">Delete</Text>
                </View>
              </RectButton>
            )}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EntryDetail", {
                  entryId: item.id,
                })
              }
              activeOpacity={0.7}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center gap-2">
                  <Calendar size={16} color="#6b7280" />
                  <Text className="text-gray-800 dark:text-gray-100 font-semibold">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {getMoodIcon(item.mood, 28)}
                  <ChevronRight size={18} color="#9ca3af" />
                </View>
              </View>

              <View className="flex-row justify-between mb-3">
                <View className="flex-row items-center gap-1">
                  <Droplets size={16} color="#3b82f6" />
                  <Text className="text-gray-700 dark:text-gray-200 text-sm">
                    {item.waterIntake} ml
                  </Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Moon size={16} color="#8b5cf6" />
                  <Text className="text-gray-700 dark:text-gray-200 text-sm">
                    {item.sleepHours} hrs
                  </Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Dumbbell size={16} color="#10b981" />
                  <Text className="text-gray-700 dark:text-gray-200 text-sm">
                    {item.exerciseMinutes} min
                  </Text>
                </View>
              </View>

              {item.notes ? (
                <Text
                  className="text-gray-500 dark:text-gray-400 text-sm mt-1"
                  numberOfLines={2}
                >
                  {item.notes}
                </Text>
              ) : (
                <Text className="text-gray-400 text-sm italic mt-1">
                  No notes added
                </Text>
              )}
            </TouchableOpacity>
          </Swipeable>
        )}
      />
    </View>
  );
}
