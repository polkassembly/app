import { View } from "react-native";
import { IconPoints } from "../icons/icon-points";
import { IconNews } from "../icons/Profile";
import { ThemedText } from "../shared/text/ThemedText";
import { useProfileStore } from "@/lib/store/profileStore";

function NewsHeader() {
	const profile = useProfileStore((state) => state.profile);
	return (
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", paddingHorizontal: 16 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
				<IconNews iconWidth={24} iconHeight={24} />
				<ThemedText type="titleMedium" style={{ fontWeight: 500, fontFamily: "PoppinsMedium"}}>News/ Explore</ThemedText>
			</View>


			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
				<IconPoints iconHeight={24} iconWidth={24}/>
				<ThemedText type="titleMedium">{profile?.profileScore}</ThemedText>
			</View>
		</View>
	)
}

export default NewsHeader;
