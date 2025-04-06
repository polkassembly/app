import { useProfileStore } from "@/lib/store/profileStore";
import { StyleSheet, View } from "react-native";
import IconBrowser  from "../icons/icon-browser";
import { IconPoints } from "../icons/icon-points";
import { ThemedText } from "../shared/text/ThemedText";
import { ThemedView } from "../shared/View/ThemedView";

const BrowserHeader = () => {
  const userProfile = useProfileStore((state) => state.profile);
  return (
    <ThemedView type="container" style={styles.titleContainer}>
      <View style={styles.titleLeft}>
        <IconBrowser />
        <ThemedText type="titleMedium" style={{ fontWeight: "500" }}>
          Browser
        </ThemedText>
      </View>
      <View style={styles.titleRight}>
        <IconPoints iconHeight={24} iconWidth={24} />
        <ThemedText type="titleMedium" style={{ fontWeight: "700" }}>
          {userProfile?.profileScore}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 10,
		zIndex: 10,
	},
	titleLeft: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
	},
	titleRight: {
		flexDirection: "row",
		gap: 6,
		alignItems: "center",
	},
});

export default BrowserHeader;