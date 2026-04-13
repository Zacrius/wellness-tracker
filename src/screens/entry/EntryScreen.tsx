import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEntryStore } from "@/store/entryStore";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList, TabParamList } from "@/types/navigation";
import type { Mood } from "@/types/entry";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import {
  ArrowLeft,
  Droplets,
  Moon,
  Dumbbell,
  Calendar,
  PenLine,
  Trash2,
  Laugh,
  Smile,
  Meh,
  Frown,
} from "lucide-react-native";
import { useFormReset } from "@/hooks/useFormReset";

const moods: Mood[] = ["great", "good", "okay", "bad"];

const moodConfig = {
  great: { icon: Laugh, color: "#FFD700", bg: "#FFF9E6", label: "Great" },
  good: { icon: Smile, color: "#4CAF50", bg: "#E8F5E9", label: "Good" },
  okay: { icon: Meh, color: "#FF9800", bg: "#FFF3E0", label: "Okay" },
  bad: { icon: Frown, color: "#F44336", bg: "#FFEBEE", label: "Bad" },
};

const entrySchema = yup.object().shape({
  waterIntake: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .max(10000, "Maximum 10,000 ml")
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return 0;
      }
      return value;
    })
    .default(0),
  sleepHours: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .max(24, "Cannot exceed 24 hours")
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return 0;
      }
      return value;
    })
    .default(0),
  exerciseMinutes: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .max(1440, "Maximum 1,440 minutes")
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return 0;
      }
      return value;
    })
    .default(0),
  notes: yup.string().max(500, "Maximum 500 characters").default(""),
  mood: yup.string().oneOf(moods).required("Mood is required"),
  date: yup.date().required("Date is required"),
});

type FormData = yup.InferType<typeof entrySchema>;

type EntryRouteProp = RouteProp<TabParamList, "Entry">;
type EntryNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "Entry">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function EntryScreen() {
  const { isDark } = useResolvedTheme();
  const navigation = useNavigation<EntryNavigationProp>();
  const route = useRoute<EntryRouteProp>();
  const entryId = route.params?.entryId;

  const addEntry = useEntryStore((s) => s.addEntry);
  const updateEntry = useEntryStore((s) => s.updateEntry);
  const entries = useEntryStore((s) => s.entries);
  const deleteEntry = useEntryStore((s) => s.deleteEntry);

  const existingEntry = entries.find((e) => e.id === entryId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(entrySchema),
    defaultValues: {
      mood: "okay",
      waterIntake: 0,
      sleepHours: 0,
      exerciseMinutes: 0,
      notes: "",
      date: new Date(),
    },
  });

  const currentMood = watch("mood") as Mood;

  useFormReset(entryId, reset, setSelectedDate);

  useEffect(() => {
    if (existingEntry) {
      // Edit mode - populate with existing entry data
      setValue("notes", existingEntry.notes || "");
      setValue("mood", existingEntry.mood || "okay");
      setValue("waterIntake", existingEntry.waterIntake || 0);
      setValue("sleepHours", existingEntry.sleepHours || 0);
      setValue("exerciseMinutes", existingEntry.exerciseMinutes || 0);
      if (existingEntry.date) {
        const date = new Date(existingEntry.date);
        setSelectedDate(date);
        setValue("date", date);
      }
    }
  }, [entryId, existingEntry, setValue]);

  const onSubmit = async (data: FormData) => {
    const now = new Date().toISOString();

    const payload = {
      notes: data.notes || "",
      mood: data.mood as Mood,
      waterIntake: data.waterIntake || 0,
      sleepHours: data.sleepHours || 0,
      exerciseMinutes: data.exerciseMinutes || 0,
      date: selectedDate.toISOString(),
      updatedAt: now,
    };

    if (entryId && existingEntry) {
      updateEntry(entryId, payload);
    } else {
      addEntry({
        id: Date.now().toString(),
        createdAt: now,
        ...payload,
      });
    }

    navigation.goBack();
  };

  const onDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setValue("date", date);
    }
    setShowDatePicker(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-950"
    >
      <LinearGradient
        colors={isDark ? ["#020617", "#0b1220"] : ["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-5 px-5 rounded-b-3xl"
      >
        <View className="flex-row items-center justify-between px-5">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 justify-center"
          >
            <ArrowLeft color="#ffffff" size={28} />
          </Pressable>
          <Text className="text-xl font-semibold text-white">
            {entryId ? "Edit Entry" : "New Entry"}
          </Text>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Date Picker */}
        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Calendar size={16} color="#6b7280" />
            <Text className="text-gray-600 dark:text-gray-300 text-sm">
              Date & Time
            </Text>
          </View>
          <Text className="text-gray-800 dark:text-gray-100 text-base font-medium">
            {selectedDate.toLocaleDateString()} at{" "}
            {selectedDate.toLocaleTimeString()}
          </Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="datetime"
            onChange={onDateChange}
          />
        )}
        {errors.date && (
          <Text className="text-red-500 text-xs mt-1 mb-4">
            {errors.date.message}
          </Text>
        )}

        {/* Mood Selector */}
        <View className="mb-6">
          <Text className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-3">
            How are you feeling?
          </Text>
          <View className="flex-row justify-between gap-3">
            {moods.map((m) => {
              const config = moodConfig[m];
              const IconComponent = config.icon;
              const isSelected = currentMood === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setValue("mood", m)}
                  className={`flex-1 items-center p-4 rounded-xl bg-white dark:bg-gray-900 ${isSelected ? "border-2" : ""}`}
                  style={[
                    {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    },
                    isSelected && { borderColor: config.color },
                  ]}
                >
                  <IconComponent
                    size={32}
                    color={config.color}
                    style={{ marginBottom: 8 }}
                  />
                  <Text
                    className="text-sm font-medium"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.mood && (
            <Text className="text-red-500 text-xs mt-2">
              {errors.mood.message}
            </Text>
          )}
        </View>

        {/* Health Metrics Grid */}
        <View className="flex-row gap-3 mb-6">
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
            <Droplets size={28} color="#3b82f6" style={{ marginBottom: 8 }} />
            <Text className="text-gray-800 dark:text-gray-100 text-sm font-semibold mb-3">
              Water
            </Text>
            <View className="flex-row items-baseline border-b border-gray-200">
              <Controller
                control={control}
                name="waterIntake"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-xl font-semibold py-1 px-0 text-gray-900 dark:text-gray-50"
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) =>
                      onChange(text === "" ? 0 : Number(text))
                    }
                    value={value?.toString() || ""}
                  />
                )}
              />
              <Text className="text-gray-400 text-sm ml-2">ml</Text>
            </View>
            {errors.waterIntake && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.waterIntake.message}
              </Text>
            )}
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
            <Moon size={28} color="#8b5cf6" style={{ marginBottom: 8 }} />
            <Text className="text-gray-800 dark:text-gray-100 text-sm font-semibold mb-3">
              Sleep
            </Text>
            <View className="flex-row items-baseline border-b border-gray-200">
              <Controller
                control={control}
                name="sleepHours"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-xl font-semibold py-1 px-0 text-gray-900 dark:text-gray-50"
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) =>
                      onChange(text === "" ? 0 : Number(text))
                    }
                    value={value?.toString() || ""}
                  />
                )}
              />
              <Text className="text-gray-400 text-sm ml-2">hrs</Text>
            </View>
            {errors.sleepHours && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.sleepHours.message}
              </Text>
            )}
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
            <Dumbbell size={28} color="#10b981" style={{ marginBottom: 8 }} />
            <Text className="text-gray-800 dark:text-gray-100 text-sm font-semibold mb-3">
              Exercise
            </Text>
            <View className="flex-row items-baseline border-b border-gray-200">
              <Controller
                control={control}
                name="exerciseMinutes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-xl font-semibold py-1 px-0 text-gray-900 dark:text-gray-50"
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(text) =>
                      onChange(text === "" ? 0 : Number(text))
                    }
                    value={value?.toString() || ""}
                  />
                )}
              />
              <Text className="text-gray-400 text-sm ml-2">mins</Text>
            </View>
            {errors.exerciseMinutes && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.exerciseMinutes.message}
              </Text>
            )}
          </View>
        </View>

        {/* Notes Section */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-3">
            <PenLine size={20} color={isDark ? "#e5e7eb" : "#1f2937"} />
            <Text className="text-gray-800 dark:text-gray-100 text-lg font-semibold">
              Personal Notes
            </Text>
          </View>
          <View
            className="bg-white dark:bg-gray-900 rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="text-base min-h-[100px] text-gray-900 dark:text-gray-50"
                  placeholder="Write your thoughts, achievements, or anything you'd like to remember..."
                  placeholderTextColor="#999"
                  multiline
                  maxLength={500}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  textAlignVertical="top"
                />
              )}
            />
            <Text className="text-gray-400 text-xs text-right mt-2">
              {watch("notes")?.length || 0}/500
            </Text>
            {errors.notes && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.notes.message}
              </Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-indigo-500 py-4 rounded-xl items-center"
            style={{
              shadowColor: "#667eea",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                {entryId ? "Update Entry" : "Save Entry"}
              </Text>
            )}
          </Pressable>

          {entryId && (
            <Pressable
              onPress={() => setShowDeleteModal(true)}
              className="bg-white dark:bg-gray-900 py-4 rounded-xl items-center border border-red-500"
            >
              <Trash2 size={20} color="#ef4444" />
              <Text className="text-red-500 text-base font-semibold ml-2">
                Delete Entry
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-4/5 items-center">
            <View className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 justify-center items-center mb-4">
              <Trash2 size={32} color="#ef4444" />
            </View>
            <Text className="text-gray-800 dark:text-gray-100 text-xl font-semibold mb-2">
              Delete Entry?
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6 leading-5">
              This action cannot be undone. This entry will be permanently
              removed from your history.
            </Text>
            <View className="flex-row gap-3 w-full">
              <Pressable
                onPress={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 items-center"
              >
                <Text className="text-gray-600 dark:text-gray-200 text-base font-medium">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (entryId) {
                    deleteEntry(entryId);
                  }
                  setShowDeleteModal(false);
                  navigation.goBack();
                }}
                className="flex-1 py-3 rounded-lg bg-red-500 items-center"
              >
                <Text className="text-white text-base font-semibold">
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
