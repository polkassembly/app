import { IVoteMetrics, ENetwork } from "@/lib/types/post";
import { formatBnBalance } from "@/lib/util";
import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { ThemedText } from "../../shared/text";
import { ThemedView, HorizontalSeparator } from "../../shared/View";
import StatusTag from "../card/header/StatusTag";
import { Colors } from "@/lib/constants/Colors";

interface SummaryProps {
	status: string | undefined;
	voteMetrics: IVoteMetrics | undefined;
	ayePercent: number;
	nayPercent: number;
}

function SummarySection({ ayePercent, status, voteMetrics, nayPercent }: SummaryProps) {
	return (
		<ThemedView
			type="background"
			style={[styles.box, { alignContent: "stretch", gap: 16 }]}
		>
			<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
				<ThemedText type="bodyLarge">Summary</ThemedText>
				<StatusTag status={status} />
			</View>

			<View style={{ gap: 4 }}>
				<VoteRatioIndicator ayePercent={ayePercent} nayPercent={nayPercent} />

				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<ThemedText type="bodySmall1" colorName="mediumText">
						Aye: {ayePercent}%
					</ThemedText>
					<ThemedText type="bodySmall1" colorName="mediumText">
						To pass: 50%
					</ThemedText>
					<ThemedText type="bodySmall" colorName="mediumText">
						Nay: {nayPercent}%
					</ThemedText>
				</View>
			</View>

			<HorizontalSeparator />

			<View style={{ padding: 16, gap: 16 }}>
				<View style={{ marginHorizontal: 8, flexDirection: "row", justifyContent: "space-between" }}>
					<View style={{ flexDirection: "row", gap: 16 }}>
						<ThemedText type="bodySmall1">Aye</ThemedText>
						<ThemedText colorName="mediumText" type="bodySmall1" style={{ lineHeight: 22 }}>
							{formatBnBalance(
								voteMetrics?.aye.value || "0",
								{ withUnit: true, numberAfterComma: 2, compactNotation: true },
								ENetwork.POLKADOT
							)}
						</ThemedText>
					</View>
					<View style={{ flexDirection: "row", gap: 16 }}>
						<ThemedText type="bodySmall1">Nay</ThemedText>
						<ThemedText colorName="mediumText" type="bodySmall1" style={{ lineHeight: 22 }}>
							{formatBnBalance(
								voteMetrics?.nay.value || "0",
								{ withUnit: true, numberAfterComma: 2, compactNotation: true },
								ENetwork.POLKADOT
							)}
						</ThemedText>
					</View>
				</View>
			</View>
		</ThemedView>
	);
}

interface VoteRatioIndicatorProps {
	ayePercent: number;
	nayPercent: number;
}

function VoteRatioIndicator({ ayePercent, nayPercent }: VoteRatioIndicatorProps) {
	const colorAye = "#31C766";
	const colorNay = "#E5304F";

	const ayePerc = ayePercent < 1 ? ayePercent * 100 : ayePercent;
	const nayPerc = nayPercent < 1 ? nayPercent * 100 : nayPercent;

	return (
		<Svg height={5}>
			<Rect width={`${ayePerc}%`} height="100%" rx="5" ry="5" fill={colorAye} />
			<Rect
				width={`${nayPerc}%`}
				x={`${ayePerc}%`}
				height="100%"
				rx="2.5"
				ry="2.5"
				fill={colorNay}
			/>
		</Svg>
	);
}

const styles = StyleSheet.create({
	box: {
		borderColor: Colors.dark.stroke,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 12,
	},
});

export default SummarySection;