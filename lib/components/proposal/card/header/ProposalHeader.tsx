import { NETWORKS_DETAILS } from '@/lib/constants/networks';
import { ENetwork, IBeneficiary } from '@/lib/types/post';
import { formatBnBalance } from '@/lib/util';
import { groupBeneficiariesByAsset } from '@/lib/util/groupBenificaryByAsset';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../../ThemedText';
import StatusTag from './StatusTag';
import { Skeleton } from 'moti/skeleton';

const CURRENT_NETWORK = ENetwork.POLKADOT

function ProposalHeader({
  index,
  status,
  beneficiaries,
  proposalNetwork,
  withoutIndex = false
}: {
  index: number | string;
  status?: string;
  beneficiaries: IBeneficiary[]
  proposalNetwork: ENetwork
  withoutIndex?: boolean
}) {
  return (
    <View style={styles.flexDirectionJustifyBetween}>
      <View style={styles.flexRowGap4}>
        {
          !withoutIndex && (
            <View style={[styles.idTextContainer, { backgroundColor: '#EAEDF0' }]}>
              <ThemedText
                type='bodySmall3'
                style={{ color: "#000000" }}
              >
                #{index}
              </ThemedText>
            </View>
          )
        }
        {status && (
          <StatusTag status={status} />
        )}
      </View>
      {beneficiaries?.length !== 0 && (
        <View style={styles.assetTextContainer}>
          <ThemedText
            type='bodySmall3'
            style={{ color: "#000000" }}
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
              .join(' | ')}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

function ProposalHeaderSkeleton() {
  return (
    <View style={styles.flexDirectionJustifyBetween}>
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flexRowGap4: {
    flexDirection: 'row',
    gap: 4
  },
  idTextContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  assetTextContainer: {
    backgroundColor: '#FFE3BB',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export { ProposalHeader, ProposalHeaderSkeleton };