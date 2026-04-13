import "./global.css";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import type { LinkingOptions } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootNavigator from "./src/navigation/RootNavigator";
import { useInitializeEntries } from "@/hooks/useInitializeEntries";
import { usePersistEntries } from "@/hooks/usePersistEntries";
import type { RootStackParamList } from "@/types/navigation";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import { useLayoutEffect } from "react";
import { colorScheme } from "nativewind";

const queryClient = new QueryClient();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["wellness://", "myapp://"],
  config: {
    screens: {
      Tabs: {
        screens: {
          Dashboard: "dashboard",
          Entry: "entry",
          History: "history",
        },
      },
      EntryDetail: "entry/:entryId",
      TipModal: "tip",
    },
  },
};

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f9fafb",
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#020617",
  },
};

export default function App() {
  useInitializeEntries();
  usePersistEntries();
  const { isDark, resolved, preference } = useResolvedTheme();

  useLayoutEffect(() => {
    // Official NativeWind API for manual/system theme control.
    // Requires Expo `userInterfaceStyle: "automatic"` for system mode to work.
    colorScheme.set(preference === "system" ? "system" : resolved);
  }, [preference, resolved]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
          linking={linking}
          theme={isDark ? MyDarkTheme : MyLightTheme}
        >
          <View className="flex-1">
            <RootNavigator />
          </View>
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
