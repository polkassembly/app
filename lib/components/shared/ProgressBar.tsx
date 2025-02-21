import Svg, { Rect } from "react-native-svg";

interface ProgressBarProps{
	progress: number;
	colorLeft: string;
	colorRight?: string;

}

function ProgressBar( { progress, colorLeft, colorRight = "white"} : ProgressBarProps) {

	const ayePerc = progress * 100;
	const nayPerc = 100 - ayePerc;

	return (
		<Svg height={5}>
			<Rect
				width={`${ayePerc}%`}
				height={"100%"}
				rx={"5"}
				ry={"5"}
				fill={colorLeft}
			/>

			<Rect
				width={`${nayPerc}%`}
				x={`${ayePerc}%`}
				height={"100%"}
				rx={"2.5"}
				ry={"2.5"}
				fill={colorRight}
			/>
		</Svg>
	);
}

export default ProgressBar;