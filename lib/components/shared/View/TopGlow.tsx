import { useThemeColor } from "@/lib/hooks"
import { LinearGradient } from "expo-linear-gradient"
import { memo } from "react"
import { DimensionValue } from "react-native"

interface TopGlowParams {
	color?: string,
	top?: DimensionValue
	height?: DimensionValue
	borderRadius?: DimensionValue
}

const TopGlow = ({ borderRadius, color, height, top }: TopGlowParams) => {
	const endColor = color ? color : useThemeColor({}, "accent")
	return (
		<LinearGradient
			colors={[endColor + "10", endColor]}
			style={{
				position: 'absolute',
				top: top || -6,
				left: 0,
				right: 0,
				height: height || 50,
				borderRadius: borderRadius || 24,
			}}
		/>
	)
}

export default memo(TopGlow);