import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { EPostOrigin, UserProfile } from "@/lib/types";
import { formatAddress, trimText } from "@/lib/util/stringUtil";
import OriginBadge from "./OriginBadge";
import TimeDisplay from "./TimeDisplay";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Skeleton } from "moti/skeleton";
import { UserAvatar } from "@/lib/components/shared";
import { ThemedText } from "@/lib/components/shared/text";
import ProfileCard from "@/lib/components/profile/ProfileCard";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { ThemedMarkdownDisplay } from "@/lib/components/shared/ThemedMarkdownDisplay";

interface ProposalBodyProps {
	title: string;
	content: string;
	proposerInfo: UserProfile | undefined;
	proposerAddress: string;
	createdAt?: string;
	descriptionLength?: number;
	origin?: EPostOrigin;
	withoutReadMore?: boolean;
}

function ProposalBody({
	title,
	content,
	createdAt,
	proposerAddress,
	proposerInfo,
	descriptionLength = 300,
	origin,
	withoutReadMore = false
}: ProposalBodyProps) {
	const [isReadMoreClicked, setIsReadMoreClicked] = useState(false);
	const [displayContent, setDisplayContent] = useState(
		trimText(content, descriptionLength)
	);

	const colorAccent = useThemeColor({}, "accent");
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();

	// Memoize the toggle function
	const toggleReadMore = useCallback(() => {
		setDisplayContent(isReadMoreClicked ? trimText(content, descriptionLength) : content);
		setIsReadMoreClicked(prev => !prev);
	}, [isReadMoreClicked, content, descriptionLength]);

	const handleOpenProfile = async () => {
		const user = proposerInfo as UserProfile;
		if (!proposerInfo) {
			Clipboard.setStringAsync(proposerAddress);
			return;
		};
		openBottomSheet(
			<ProfileCard user={user} />
		);
	};

	return (
		<View style={styles.flexColumnGap8}>
			<View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
				<TouchableOpacity onPress={handleOpenProfile}>
					<View style={styles.flexRowGap4}>
						<View style={{ width: 12, height: 12, borderRadius: 16 }}>
							<UserAvatar
								address={proposerAddress}
								avatarUrl={proposerInfo?.profileDetails?.image || ""}
								width={12}
								height={12}
							/>
						</View>
						<ThemedText type="bodySmall3" style={{ fontWeight: "400" }}>
							{proposerInfo?.username || formatAddress(proposerAddress) || "User"}
						</ThemedText>
					</View>
				</TouchableOpacity>

				{origin && <OriginBadge origin={origin} />}
				<View style={{ width: 1, height: "100%", backgroundColor: "#383838" }} />
				{createdAt && <TimeDisplay createdAt={createdAt} />}
			</View>

			<ThemedText type="bodyMedium2" style={{ letterSpacing: 1 }}>
				{trimText(title, 80)}
			</ThemedText>

			<ThemedMarkdownDisplay
				content={displayContent}
			/>

			{!withoutReadMore && content.length > descriptionLength && (
				<TouchableOpacity onPress={toggleReadMore}>
					<View style={styles.flexRowGap4}>
						<ThemedText type="bodySmall" colorName="accent">
							Read {isReadMoreClicked ? "Less" : "More"}
						</ThemedText>
						<Ionicons
							name={isReadMoreClicked ? "chevron-up" : "chevron-down"}
							size={16}
							color={colorAccent}
						/>
					</View>
				</TouchableOpacity>
			)}
		</View>
	);
}

function ProposalBodySkeleton() {
	return (
		<View style={styles.flexColumnGap8}>
			<View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
				<View style={styles.flexRowGap4}>
					<View style={{ width: 15, height: 15, borderRadius: 16 }}>
						<Skeleton />
					</View>
					<Skeleton width={50} />
				</View>
			</View>
			<Skeleton width={70} />
			<Skeleton width="100%" height={100} />
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
});

export { ProposalBody, ProposalBodySkeleton };