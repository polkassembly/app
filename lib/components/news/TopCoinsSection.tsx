import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks";
import { Ionicons } from "@expo/vector-icons";

// Interface for coin data
interface CoinData {
  id: string;
  name: string;
  current_price: number;
  sparkline_in_7d: {
    price: number[];
  };
}

const coinLogo: { [key: string]: any } = {
  "polkadot": require("@/assets/images/logo/polkadot-logo.webp"),
  "kusama": require("@/assets/images/logo/kusama-logo.webp"),
}

export default function TopCoinsSection() {
  const [coinData, setCoinData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, "background");

  const fetchCoinData = async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot,kusama&sparkline=true",
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch coin data");
      }

      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error("Error fetching coin data:", err);
      setError("Failed to load coin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, []);

  const renderSparkline = ( oneDayData: number[]) => {
    if (!oneDayData || oneDayData.length === 0) return null;

    const min = Math.min(...oneDayData);
    const max = Math.max(...oneDayData);
    const range = max - min;
    const isUp = oneDayData[0] < oneDayData[oneDayData.length - 1];
    const color = isUp ? "rgba(52, 199, 89, 0.8)" : "rgba(255, 59, 48, 0.8)";
    const graphHeight = 50;
    const graphWidth = 100; // Fixed width for the sparkline
    const step =
      oneDayData.length > 1 ? graphWidth / (oneDayData.length - 1) : 0;

    let path = "";
    for (let i = 0; i < oneDayData.length; i++) {
      const x = i * step;
      const normalized =
        range === 0 ? 0.5 : (oneDayData[i] - min) / range;
      const y = graphHeight - normalized * graphHeight;
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }

    return (
      <View style={{ width: "100%", height: graphHeight }}>
        <Svg
          width="100%"
          height={graphHeight}
        >
          <Path d={path} fill="none" stroke={color} strokeWidth={2} />
        </Svg>
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.topCoinsContainer}>
        <ThemedText type="titleSmall">Top Coins</ThemedText>
        <View style={styles.errorContainer}>
          <ThemedText type="bodyMedium1">{error}</ThemedText>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: backgroundColor }]}
            onPress={fetchCoinData}
          >
            <Ionicons name="refresh" size={16} color="#fff" />
            <ThemedText type="bodyMedium1" style={styles.retryText}>
              Retry
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.topCoinsContainer}>
      <ThemedText type="titleSmall">Top Coins</ThemedText>
      <View style={styles.coinsContainer}>
        {loading ? (
          <>
            <View style={[styles.coinBox, styles.loadingCoinBox]}>
              <ActivityIndicator size="small" color={Colors.dark.tint} />
            </View>
            <View style={[styles.coinBox, styles.loadingCoinBox]}>
              <ActivityIndicator size="small" color={Colors.dark.tint} />
            </View>
          </>
        ) : (
          <>
            {coinData.map((coin) => {
              // Use only the last 24 data points from the sparkline array (for 1-day data)
              const oneDayData = coin.sparkline_in_7d.price.slice(-24);
              if (oneDayData.length === 0) return null;

              const firstPrice = oneDayData[0];
              const lastPrice = oneDayData[oneDayData.length - 1];
              const percentageChange =
                ((lastPrice - firstPrice) / firstPrice) * 100;
              const isUp = firstPrice < lastPrice;

              return (
                <View
                  key={coin.id}
                  style={styles.coinBox}
                >
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 9 }}>
                    <Image
                    source={coinLogo[coin.name.toLowerCase()]}
                    style={{ width: 20, height: 20, borderRadius: 10, borderColor: "#79767D", borderWidth: coin.name === "Kusama" ? 1 : 0 }}
                    resizeMode="contain"
                    />
                    <ThemedText type="titleSmall" style={{}}>
                      {coin.name}
                    </ThemedText>
                  </View>
                  <ThemedText type="bodyMedium2" style={styles.coinValue}>
                    ${coin.current_price.toFixed(2)}
                  </ThemedText>
                  <ThemedText
                    type="bodyMedium3"
                    style={[
                      styles.percentageText,
                      {
                        color: isUp
                          ? "rgba(52, 199, 89, 1)"
                          : "rgba(255, 59, 48, 1)",
                      },
                    ]}
                  >
                    {percentageChange.toFixed(2)}%
                  </ThemedText>
                  {renderSparkline(oneDayData)}
                </View>
              );
            })}
            {coinData.length === 0 && (
              <>
                <TouchableOpacity
                  style={styles.coinBox}
                  onPress={fetchCoinData}
                >
                  <ThemedText type="titleSmall" style={styles.coinName}>
                    Polkadot
                  </ThemedText>
                  <ThemedText type="bodyMedium1" style={styles.coinValue}>
                    Tap to refresh
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.coinBox}
                  onPress={fetchCoinData}
                >
                  <ThemedText type="titleSmall" style={styles.coinName}>
                    Kusama
                  </ThemedText>
                  <ThemedText type="bodyMedium1" style={styles.coinValue}>
                    Tap to refresh
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topCoinsContainer: {
    padding: 16,
    marginBottom: 8,
  },
  coinsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 8,
  },
  coinBox: {
    flex: 1,
    maxWidth: "45%",
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#383838",
    alignItems: "flex-start",
  },
  loadingCoinBox: {
    justifyContent: "center",
    alignItems: "center",
    height: 120,
  },
  coinName: {
    marginBottom: 8,
  },
  coinValue: {
    marginBottom: 2,
    color: "#79767D",
  },
  percentageText: {
    marginBottom: 21,
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    gap: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  retryText: {
    color: "#fff",
  },
});
