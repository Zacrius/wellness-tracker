import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Dashboard: undefined;
  Entry: { entryId?: string };
  History: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  EntryDetail: { entryId: string };
  TipModal: undefined;
};
