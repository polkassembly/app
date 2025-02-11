import Svg, { Circle, Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconWarn({ style, color, iconHeight, iconWidth }: IconProps) {
	return (
		<Svg width={iconWidth || 20} height={iconHeight || 20} viewBox="0 0 24 24" fill="none" style={style}>
			<Circle 
				cx="12" 
				cy="12" 
				r="10" 
				stroke={color || "#F53C3C"} 
				strokeWidth="1.5"
			/>
			<Path
				d="M12 8V8.01"
				stroke={color || "#F53C3C"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M12 12V16"
				stroke={color || "#F53C3C"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}
