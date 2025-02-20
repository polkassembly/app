import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconPencil({ color = "white", filled,  iconHeight, iconWidth, style }: IconProps) {
	return (
		<Svg
			width={iconWidth ?? 16}
			height={iconHeight ?? 15}
			viewBox="0 0 16 15"
			fill= {filled ? color : "none"}
			style={style}
		>
			<Path
				d="M10.6783 2.48532L11.8464 1.31718C12.4916 0.672043 13.5376 0.672043 14.1828 1.31718C14.8278 1.96233 14.8278 3.00831 14.1828 3.65345L13.0146 4.82158M10.6783 2.48532L3.81678 9.34691C2.94569 10.218 2.51014 10.6535 2.21356 11.1842C1.91698 11.715 1.61859 12.9682 1.33325 14.1667C2.53166 13.8813 3.78491 13.5829 4.31566 13.2863C4.84641 12.9897 5.28195 12.5542 6.15304 11.6832L13.0146 4.82158M10.6783 2.48532L13.0146 4.82158"
				stroke={color}
				strokeWidth={1.25}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M7.16675 14.1667H12.1667"
				stroke={color}
				strokeWidth={1.25}
				strokeLinecap="round"
			/>
		</Svg>
	);
}