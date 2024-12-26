import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { NavigateButton } from "../shared/NavigateButton";

// Define the structure of a badge item
type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
};

const testBadges: Badge[] = [
  {
    id: 1,
    name: "Top Contributor",
    description: "Awarded for being a top contributor this month",
    icon: Asset.fromModule(require('@/assets/images/crown.png')).uri,
  },
  {
    id: 2,
    name: "Bug Hunter",
    description: "Awarded for identifying critical bugs",
    icon: Asset.fromModule(require('@/assets/images/sword.png')).uri,
  },
  {
    id: 3,
    name: "Early Adopter",
    description: "Awarded for being an early adopter of our platform",
    icon: Asset.fromModule(require('@/assets/images/shield.png')).uri, 
  },
];

export function Badges(): JSX.Element {
  const navigation = useNavigation();

  const handleNavigate = () => {
    // Handle navigation logic here
  };

  return (
    <ThemedView type="container" style={styles.container}>
      <View>
        <ThemedText type="bodyMedium1" style={styles.title}>
          Badges
        </ThemedText>
        <ThemedText type="bodySmall3" style={styles.subtitle}>
          16 earned
        </ThemedText>
      </View>

      {testBadges.slice(0, 3).map((badge) => (
          <ThemedView key={badge.id} style={styles.badgeIconContainer} type="secondaryContainer">
            <Image source={{ uri: badge.icon }} style={ styles.badgeImage }/>
          </ThemedView>
      ))}
      
      <NavigateButton onPress={handleNavigate} containerSize={52} iconSize={32}/>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 15,
  },
  badgeIconContainer: {
    borderRadius: 25,
    width: 52,
    height: 52,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeImage: {
    width: 32,
    height: 32,
    
  },  
});
