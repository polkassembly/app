import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconFireworks({ style, color, iconHeight, iconWidth }: IconProps) {
	return (
		<Svg width={iconWidth || 20} height={iconHeight || 20} viewBox="0 0 22 20" fill="none" style={style}>
			<Path
				d="M18 16C16.5 10.5 11 9 11 9C11 9 7 12.5 7 19"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M1 8.0249C2.33333 7.01472 6.2 5.80245 11 9.0352C12.1667 7.35033 15.8 4.38511 21 6.00281"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M14 3C13 3.66667 11 5.8 11 9C10.6667 7.33333 9 3.6 5 2"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M5 12C5.98663 11 8.55185 9 10.9198 9C11.9064 10.1667 12.8069 12 12.3997 16"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M12 18.4922V18.5022"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M16 1V1.01"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M19 10V10.01"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M10 2V2.01"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M17 9V9.01"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M2 1V1.01"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M3 14V14.01"
				stroke={color || "#9603CC"}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
}
