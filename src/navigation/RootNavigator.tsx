import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import TabNavigator from './TabNavigator';
import { EntryDetailScreen } from '@/screens/entry';
import TipModalScreen from "@/screens/tips/TipModalScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
      <Stack.Screen
        name="TipModal"
        component={TipModalScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}
