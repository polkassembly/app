// StackedAvatars.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { UserAvatar } from "../shared";

interface StackedAvatarsProps {
	avatars: string[];
	size?: number;
	offset?: number;
	containerStyle?: ViewStyle;
}

export default function StackedAvatars({
	avatars,
	size = 17,
	offset = 4,
	containerStyle,
}: StackedAvatarsProps) {
	const hasAvatars = avatars.length > 0;
	const totalAvatars = hasAvatars ? avatars.length + 1 : 1;
	const containerWidth = size + offset * (totalAvatars - 1);

	return (
		<View style={[styles.container, { width: containerWidth, height: size }, containerStyle]}>
			{hasAvatars &&
				avatars.slice(0, 4).map((avatarUrl, index) => (
					<View
						key={`avatar-${index}`}
						style={[
							styles.avatarWrapper,
							{ left: index * offset, zIndex: index },
						]}
					>
						<UserAvatar avatarUrl={avatarUrl} width={size} height={size} />
					</View>
				))
			}
			{
				!hasAvatars &&
				<UserAvatar avatarUrl="" width={size} height={size} />
			}

			{/* Always render the black avatar on top */}
			<View
				style={[
					styles.avatarWrapper,
					{ left: (hasAvatars ? avatars.length : 1) * offset, zIndex: totalAvatars + 1 },
				]}
			>
				<View style={{ width: size, height: size, borderRadius: size, backgroundColor: "#000000" }} />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
	},
	avatarWrapper: {
		position: "absolute",
	},
});
