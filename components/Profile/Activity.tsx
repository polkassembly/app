import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { IconSmile } from "../icons/Profile/icon-smile";
import { IconEarnedPoints } from "../icons/Profile/icon-earned-points";
import { ThemedText } from "../ThemedText";
import { NavigateButton } from "../shared/NavigateButton";
import { ThemedView } from "../ThemedView";

const activityData = [
  {
    id: 1,
    type: "like" as "like",
    link: "post link",
  },
  {
    id: 2,
    type: "points" as "points",
    points: 10,
    link: "game link",
  },
  {
    id: 3,
    type: "like" as "like",
    link: "post link",
  },
  {
    id: 4,
    type: "points" as "points",
    points: -20,
    link: "action link",
  },
];

type ActivityItemProps = {
  id: number;
  type: "like" | "points";
  points?: number;
  link: string;
};

export function Activity() {
  return (
    <View style={styles.mainContainer}>
      <ThemedText type="default">RECENT ACTIVITY</ThemedText>
      {activityData.map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
    </View>
  );
}

function ActivityItem({ item }: { item: ActivityItemProps }) {
  const handleNavigate = () => {
    console.log(`Navigating to: ${item.link}`);
  };

  // Format points with "+" for positive, "-" for negative
  const formattedPoints = item.points ? `${item.points > 0 ? '+' : ''}${item.points}pts` : '';

  // Determine text color based on the points
  const pointsColor = item.points && item.points > 0 ? 'green' : item.points && item.points < 0 ? 'red' : 'white';

  return (
    <ThemedView type="container" style={styles.activityItemContainer}>
      {item.type === "like" ? (
        <>
          <View style={styles.iconTextContainer}>
            <IconSmile color="white" />
            <ThemedText type="default">Liked a Proposal</ThemedText>
          </View>
          <NavigateButton containerSize={30} iconSize={15} onPress={handleNavigate} />
        </>
      ) : (
        <>
          <View style={styles.iconTextContainer}>
            <IconEarnedPoints color="white" />
            <ThemedText type="default">
              Earned <ThemedText style={{ color: pointsColor }}>{formattedPoints}</ThemedText> for playing
            </ThemedText>
          </View>
          <NavigateButton containerSize={30} iconSize={15} onPress={handleNavigate} />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  activityItemContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 12,
    alignItems: "center",
    borderRadius: 34,
  },
  iconTextContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
