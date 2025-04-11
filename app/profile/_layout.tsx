import { ThemedView } from "@/lib/components/shared/View";
import { Stack } from "expo-router";

export default function () {
	return (
		<ThemedView style={{ flex: 1, paddingTop: 12 }} type="secondaryBackground">
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		</ThemedView>
	);
}
