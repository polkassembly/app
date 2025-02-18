import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconVotedProposal({ style, color, iconHeight, iconWidth }: IconProps) {
	return (
		<Svg width={iconWidth || 30} height={iconHeight || 29} viewBox="0 0 30 29" fill="none" style={style}>
			<Path
				d="M21.698 2.54476L20.4252 2.20564C16.8254 1.24647 15.0254 0.766896 13.6074 1.58098C12.1893 2.39506 11.707 4.18488 10.7424 7.76454L9.37825 12.8269C8.41364 16.4065 7.93135 18.1964 8.75004 19.6064C9.56873 21.0165 11.3687 21.496 14.9687 22.4552L16.2415 22.7944C19.8414 23.7535 21.6414 24.2331 23.0594 23.4191C24.4774 22.6049 24.9598 20.8151 25.9243 17.2355L27.2884 12.1731C28.2531 8.59339 28.7354 6.80356 27.9167 5.39354C27.098 3.98351 25.298 3.50392 21.698 2.54476Z"
				stroke={color || "#E5007A"}
				strokeWidth="1.5"
			/>
			<Path
				d="M21.4717 8.41073C21.4717 9.49617 20.5868 10.3761 19.4952 10.3761C18.4036 10.3761 17.5187 9.49617 17.5187 8.41073C17.5187 7.32529 18.4036 6.44537 19.4952 6.44537C20.5868 6.44537 21.4717 7.32529 21.4717 8.41073Z"
				stroke={color || "#E5007A"}
				strokeWidth="1.5"
			/>
			<Path
				d="M15 26.4284L13.7302 26.7741C10.1387 27.7521 8.34292 28.2412 6.92822 27.4111C5.51352 26.5811 5.03235 24.7561 4.07 21.1063L2.70906 15.9445C1.74671 12.2947 1.26554 10.4697 2.08232 9.03204C2.78886 7.7884 4.3333 7.83368 6.3333 7.83352"
				stroke={color || "#E5007A"}
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</Svg>
	);
}
