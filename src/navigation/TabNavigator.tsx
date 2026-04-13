import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "../types/navigation";
import DashboardScreen from "@/screens/dashboard";
import { EntryScreen } from "@/screens/entry";
import HistoryScreen from "@/screens/history";
import { Activity, PlusCircle, History } from "lucide-react-native";
import { Platform } from "react-native";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const { isDark } = useResolvedTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        headerStyle: {
          height: Platform.OS === "ios" ? 60 : 70,
          backgroundColor: isDark ? "#030712" : "#ffffff",
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: isDark ? "#a5b4fc" : "#667eea",
        tabBarInactiveTintColor: isDark ? "#9ca3af" : "#9ca3af",
        tabBarStyle: {
          backgroundColor: isDark ? "#030712" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#111827" : "#f3f4f6",
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Entry"
        component={EntryScreen}
        options={{
          tabBarLabel: "Log",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
