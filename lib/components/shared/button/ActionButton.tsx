import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ContainerType, ThemedView } from "../../ThemedView";

interface IconProps {
	color: string;
	iconWidth: number;
	iconHeight: number;
}

interface ActionButtonProps {
	Icon: React.FC<IconProps>;
	text?: string;
	containerSize: number;
	iconSize: number;
	containerType?: ContainerType
	onPress?: () => void;
	bordered?: boolean
}

const ActionButton: React.FC<ActionButtonProps> = ({
	Icon,
	text,
	containerSize,
	iconSize,
	containerType,
	bordered = false
}) => {
	return (
		<View style={styles.wrapper}>
			<ThemedView
				type={containerType || "container"}
				style={[
					styles.iconContainer,
					{ width: containerSize, height: containerSize, borderRadius: containerSize/2 },
					bordered && styles.bordered
				]}
			>
				<Icon color="#FFF" iconWidth={iconSize} iconHeight={iconSize} />
			</ThemedView>
			{
				text && <ThemedText type="bodySmall">{text}</ThemedText>
			}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		alignItems: "center",
		gap: 6,
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	bordered: {
		borderWidth: 2,
		borderColor: "#383838",
	}
});

export default ActionButton;
