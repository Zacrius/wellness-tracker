import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useEntryStore } from "@/store/entryStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import {
  Calendar,
  Droplets,
  Moon,
  Dumbbell,
  PenLine,
  Trash2,
  Edit3,
  ArrowLeft,
  Smile,
  Laugh,
  Meh,
  Frown,
} from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "EntryDetail">;

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

export default function EntryDetailScreen({ route, navigation }: Props) {
  const { isDark } = useResolvedTheme();
  const { entryId } = route.params;
  const entry = useEntryStore((s) => s.entries.find((e) => e.id === entryId));
  const deleteEntry = useEntryStore((s) => s.deleteEntry);

  if (!entry) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-950 items-center justify-center p-6">
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          Entry not found
        </Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteEntry(entryId);
          navigation.goBack();
        },
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-950 mt-20">
      {/* Header */}
      <LinearGradient
        colors={isDark ? ["#020617", "#0b1220"] : ["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-5 rounded-b-3xl"
      >
        <View className="flex-row items-center mb-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 justify-center"
          >
            <ArrowLeft color="#ffffff" size={28} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Entry Details</Text>
            <Text className="text-white/80 text-sm">
              View and manage your health log
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View className="px-5 mt-6">
        {/* Date Card */}
        <View
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <Calendar size={20} color={isDark ? "#a5b4fc" : "#667eea"} />
            <Text className="text-gray-700 dark:text-gray-200 font-semibold">
              Date & Time
            </Text>
          </View>
          <Text className="text-gray-800 dark:text-gray-100 text-base">
            {formatDate(entry.date)}
          </Text>
        </View>

        {/* Mood Card */}
        <View
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-gray-700 dark:text-gray-200 font-semibold mb-3">
            Mood
          </Text>
          <View className="flex-row items-center gap-3">
            {getMoodIcon(entry.mood, 48)}
            <Text className="text-gray-800 dark:text-gray-100 text-lg capitalize">
              {entry.mood}
            </Text>
          </View>
        </View>

        {/* Health Metrics Grid */}
        <View className="flex-row gap-3 mb-4">
          {/* Water Card */}
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
              Water
            </Text>
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {entry.waterIntake} ml
            </Text>
          </View>

          {/* Sleep Card */}
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
              Sleep
            </Text>
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {entry.sleepHours} hrs
            </Text>
          </View>

          {/* Exercise Card */}
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
              Exercise
            </Text>
            <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {entry.exerciseMinutes} min
            </Text>
          </View>
        </View>

        {/* Notes Card */}
        <View
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 mb-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center gap-2 mb-3">
            <PenLine size={20} color={isDark ? "#e5e7eb" : "#1f2937"} />
            <Text className="text-gray-700 dark:text-gray-200 font-semibold">
              Personal Notes
            </Text>
          </View>
          {entry.notes ? (
            <Text className="text-gray-700 dark:text-gray-200 leading-5">
              {entry.notes}
            </Text>
          ) : (
            <Text className="text-gray-400 italic">No notes added</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-8">
          <Pressable
            onPress={() =>
              navigation.navigate("Tabs", {
                screen: "Entry",
                params: { entryId: entry.id },
              })
            }
            className="bg-indigo-500 py-4 rounded-xl items-center flex-row justify-center gap-2"
            style={{
              shadowColor: "#667eea",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Edit3 size={20} color="#ffffff" />
            <Text className="text-white text-base font-semibold">
              Edit Entry
            </Text>
          </Pressable>

          <Pressable
            onPress={handleDelete}
            className="bg-white dark:bg-gray-900 py-4 rounded-xl items-center flex-row justify-center gap-2 border border-red-500"
          >
            <Trash2 size={20} color="#ef4444" />
            <Text className="text-red-500 text-base font-semibold">
              Delete Entry
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
