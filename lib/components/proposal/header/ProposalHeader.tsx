import { NETWORKS_DETAILS } from "@/lib/constants/networks";
import { ENetwork, IBeneficiary } from "@/lib/types/post";
import { formatBnBalance } from "@/lib/util";
import { groupBeneficiariesByAsset } from "@/lib/util/groupBenificaryByAsset";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../ThemedText";
import StatusTag from "./StatusTag";
import { Skeleton } from "moti/skeleton";

const CURRENT_NETWORK = ENetwork.POLKADOT

function ProposalHeader({
  index,
  status,
  beneficiaries,
	proposalNetwork
}: {
  index: number | string;
  status?: string;
	beneficiaries: IBeneficiary[]
	proposalNetwork: ENetwork
}) {
  return (
    <View style={styles.flexDirectionJustifyBetween}>
      <View style={styles.flexRowGap4}>
        <ThemedText type="bodySmall3" style={styles.idText}>
          #{index}
        </ThemedText>
        {status && (
          <StatusTag status={status} />
        )}
      </View>
      {beneficiaries?.length !== 0 && (
        <ThemedText
          type="bodySmall"
          style={{
            backgroundColor: "#FFE3BB",
            paddingHorizontal: 4,
            borderRadius: 4,
            color: "#000",
          }}
        >
          {Object.entries(
            groupBeneficiariesByAsset(
              beneficiaries,
              proposalNetwork
            )
          )
            .map(([assetId, amount]) =>
              formatBnBalance(
                amount.toString(),
                {
                  withUnit: true,
                  numberAfterComma: 2,
                  compactNotation: true,
                },
                CURRENT_NETWORK,
                assetId === NETWORKS_DETAILS[`${CURRENT_NETWORK}`].tokenSymbol
                  ? null
                  : assetId
              )
            )
            .join(" | ")}
        </ThemedText>
      )}
    </View>
  );
}

function ProposalHeaderSkeleton(){
  return (
    <View style = {styles.flexDirectionJustifyBetween}>
      <View style={styles.flexRowGap4}>
        <Skeleton width={50} />
        <Skeleton width={60} />
      </View>
      <View>
        <Skeleton width={50} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
	flexDirectionJustifyBetween: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	flexRowGap4: {
		flexDirection: "row",
		gap: 4
	},
	idText: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: "#EAEDF0",
    color: "#000",
    borderRadius: 4,
  }
})

export { ProposalHeader, ProposalHeaderSkeleton };