import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface OutlinedTextProps {
	children: React.ReactNode;
	fontSize?: number;
	fontFamily?: string;
	textColor?: string;
	shadowRadius?: number;
	shadowOffset?: { width: number; height: number };
}

const OutlinedText: React.FC<OutlinedTextProps> = ({
	children,
	fontSize = 20,
	fontFamily = "LilitaOneRegular",
	textColor = "#FEFDFB",
	shadowRadius = 2,
	shadowOffset = { width: 0, height: 3 },
}) => {
	return (
		<View style={{ position: "relative", justifyContent: "center", alignItems: "center" }}>
			<Text
				style={[
					styles.outlineText,
					{
						color: "#000000",
						fontSize: fontSize,
						fontFamily: fontFamily,
						textShadowColor: "#000000",
						textShadowOffset: { width: 1, height: 1 },
						textShadowRadius: 1,
					},
				]}
			>
				{children}
			</Text>
			<Text
				style={[
					styles.outlineText,
					{
						color: "#000000",
						fontSize: fontSize,
						fontFamily: fontFamily,
						textShadowColor: "#000000",
						textShadowOffset: { width: -1, height: 1 },
						textShadowRadius: 1,
					},
				]}
			>
				{children}
			</Text>
			<Text
				style={[
					styles.outlineText,
					{
						color: "#000000",
						fontSize: fontSize,
						fontFamily: fontFamily,
						textShadowColor: "#000000",
						textShadowOffset: { width: 1, height: -1 },
						textShadowRadius: 1,
					},
				]}
			>
				{children}
			</Text>
			<Text
				style={[
					styles.outlineText,
					{
						color: "#000000",
						fontSize: fontSize,
						fontFamily: fontFamily,
						textShadowColor: "#000000",
						textShadowOffset: { width: -1, height: -1 },
						textShadowRadius: 1,
					},
				]}
			>
				{children}
			</Text>
			<Text
				style={[
					styles.mainText,
					{
						color: textColor,
						fontSize: fontSize,
						fontFamily: fontFamily,
						textShadowColor: "#000000",
						textShadowOffset: { width: shadowOffset.width, height: shadowOffset.height },
						textShadowRadius: shadowRadius,
					},
					
				]}
			>
				{children}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	outlineText: {
		position: "absolute",
		top: 0,
		left: 0,
		zIndex: -1,
		letterSpacing: 0,

	},
	mainText: {
		letterSpacing: 0,
		textAlign: "center",
	},
});

export default OutlinedText;