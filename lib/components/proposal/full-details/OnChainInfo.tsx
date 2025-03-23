import { OnChainPostInfo } from "@/lib/types/post";
import { pascalToNormal } from "@/lib/util/stringUtil";
import { StyleSheet, View } from "react-native";
import HorizontalSeparator from "../../shared/HorizontalSeparator";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";

function OnChainInfo({ onChainInfo }: { onChainInfo: OnChainPostInfo }) {
	return (
		<ThemedView type="background" style={styles.container}>
			<ThemedText type="bodyMedium1">Metadata</ThemedText>

			<View style={{ flexDirection: "column", gap: 16, width: "100%" }}>
				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Proposal Hash</ThemedText>
					<ThemedText style={{ flex: 1, flexWrap: "wrap" }} type="bodySmall">{onChainInfo.hash}</ThemedText>
				</View>
				<HorizontalSeparator />
				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Origin</ThemedText>
					<ThemedText type="bodySmall">{pascalToNormal(onChainInfo.origin || "")}</ThemedText>
				</View>
				<HorizontalSeparator />
				{
					onChainInfo.createdAt && (
						<>
							<View style={{ flexDirection: "row" }}>
								<ThemedText style={{ width: "30%" }} type="bodySmall">Created At</ThemedText>
								<ThemedText type="bodySmall">{(new Date(onChainInfo.createdAt)).toLocaleDateString()}</ThemedText>
							</View>
							<HorizontalSeparator />
						</>
					)
				}

				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Description</ThemedText>
					<ThemedText type="bodySmall">{onChainInfo.description}</ThemedText>
				</View>
				<HorizontalSeparator />

				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Status</ThemedText>
					<ThemedText type="bodySmall">{pascalToNormal(onChainInfo.status)}</ThemedText>
				</View>
				<HorizontalSeparator />

			</View>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 12,
		borderRadius: 12,
		borderColor: "#383838",
		borderWidth: 1,
		gap: 20,
	},
});

export default OnChainInfo;