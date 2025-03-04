import { View, Image } from "react-native";
import { ThemedText } from "../ThemedText";

function TreasurySection() {
	return (
		<View style={{ flex: 1, width: '100%', height: 220}}>
			<Image
				source={require('@/assets/gif/treasury_bg.gif')}
				style={{
					width: '100%',
					height: 220,
					resizeMode: 'contain',
				}}
			/>
			<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
				<View
					style={{
						width: 220,
						height: 140,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Image
						source={require('@/assets/images/news/treasury.png')}
						style={{
							width: "100%",
							height: "100%",
							resizeMode: "contain",
						}}
					/>
					<View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
						<ThemedText style={{ fontSize: 15, fontWeight: 400, lineHeight: 23}}>Polkadot Treasury</ThemedText>
						<ThemedText style={{ fontSize: 32, fontWeight: 600, lineHeight: 48}}>18,236 DOT</ThemedText>
						<ThemedText type="titleMedium" style={{ opacity: 0.53}}>~$18k</ThemedText>
					</View>
				</View>
			</View>
		</View>
	);
}

export default TreasurySection;