import React, { memo } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	TouchableOpacityProps,
	ViewStyle,
} from "react-native";
import { ThemedText } from "../../ThemedText";
import { ContainerType, ThemedView } from "../../ThemedView";

interface IconProps {
	color: string;
	iconWidth: number;
	iconHeight: number;
}

interface ActionButtonProps extends TouchableOpacityProps {
	Icon: React.FC<IconProps>;
	text?: string;
	containerSize: number;
	iconSize: number;
	containerType?: ContainerType;
	bordered?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
	Icon,
	text,
	containerSize,
	iconSize,
	containerType = "container",
	bordered = false,
	style,
	...touchableProps
}) => {
	const containerStyle: ViewStyle[] = [
		styles.iconContainer,
		{
			width: containerSize,
			height: containerSize,
			borderRadius: containerSize / 2,
		},
		bordered ? styles.bordered : {}
	];

	return (
		<TouchableOpacity style={[styles.wrapper, style]} {...touchableProps}>
			<ThemedView type={containerType} style={containerStyle}>
				<Icon color="#FFF" iconWidth={iconSize} iconHeight={iconSize} />
			</ThemedView>
			{text && <ThemedText type="bodySmall">{text}</ThemedText>}
		</TouchableOpacity>
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
	},
});

export default memo(ActionButton);
