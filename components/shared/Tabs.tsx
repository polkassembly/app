import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Tab<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  selectedTab: string;
  onChange: (id: T) => void;
}

export default function Tabs<T extends string>({
  tabs,
  selectedTab,
  onChange,
}: TabsProps<T>) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onChange(tab.id)}
          style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabLabel,
              selectedTab === tab.id && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 7,
    padding: 4,
    backgroundColor: Colors.dark.secondaryBackground,
  },

  tab: {
    flex: 1,
    padding: 4,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: Colors.dark.background,
  },
  tabLabel: {
    color: Colors.dark.mediumText,
  },
  activeTabLabel: {
    color: Colors.dark.text,
  },
});
