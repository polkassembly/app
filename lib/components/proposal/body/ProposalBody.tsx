
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";
import { Colors } from "react-native/Libraries/NewAppScreen";

import { EPostOrigin, UserProfile } from "@/lib/types";
import { trimText } from "@/lib/util/stringUtil";
import { UserAvatar } from "../../shared";
import { ThemedText } from "../../ThemedText";
import OriginBadge from "./OriginBadge";
import TimeDisplay from "./TimeDisplay";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

interface ProposalBodyProps {
	title: string;
	htmlContent: string;
	createdAt?: string;
	proposerInfo: UserProfile | undefined;
	descriptionLength?: number;
	origin?: EPostOrigin;
}

function ProposalBody({
	title,
	htmlContent,
	createdAt,
	proposerInfo,
	descriptionLength = 300,
	origin,
}: ProposalBodyProps) {
	const [isReadMoreClicked, setIsReadMoreClicked] = useState(false);
	const [postDescriptionHTML, setPostDescriptionHTML] = useState(
		trimText(htmlContent, descriptionLength)
	);

	const toggleReadMore = () => {
		setPostDescriptionHTML(isReadMoreClicked ? trimText(htmlContent, descriptionLength) : htmlContent);
		setIsReadMoreClicked(!isReadMoreClicked);
	};

	const colorText = useThemeColor({}, "text")

	return (
		<View style={styles.flexColumnGap8}>
			<View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>

				<View style={styles.flexRowGap4}>
					<View style={{ width: 15, height: 15, borderRadius: 16 }}>
						<UserAvatar avatarUrl={proposerInfo?.profileDetails?.image || ""} width={15} height={15} />
					</View>
					<ThemedText type="bodySmall3">
						{proposerInfo?.username || "User"}
					</ThemedText>
				</View>

				{origin && <OriginBadge origin={origin} />}
				<View style={{ width: 1, height: "100%", backgroundColor: "#383838" }} />
				{
					createdAt && <TimeDisplay createdAt={createdAt} />
				}
			</View>
			<ThemedText type="bodyMedium2" style={{ letterSpacing: 1 }}>
				{trimText(title, 80)}
			</ThemedText>
			<RenderHTML
				source={{ html: postDescriptionHTML }}
				baseStyle={{ color: colorText }}
				contentWidth={300}
			/>
			{htmlContent.length > descriptionLength && (
				<TouchableOpacity onPress={toggleReadMore}>
					<View style={styles.flexRowGap4}>
						<ThemedText type="bodySmall" colorName="accent">
							Read {isReadMoreClicked ? "Less" : "More"}
						</ThemedText>
						<Ionicons
							name={isReadMoreClicked ? "chevron-up" : "chevron-down"}
							size={16}
							color={Colors.dark.accent}
						/>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	flexColumnGap8: {
		flexDirection: "column",
		gap: 8
	},
	flexRowGap4: {
		flexDirection: "row",
		gap: 4
	},
})

export default ProposalBody;