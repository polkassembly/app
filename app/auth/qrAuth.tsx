import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import useQrAuth from "@/net/queries/auth/useQrAuth";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedButton from "@/components/ThemedButton";
import IconWarn from "@/components/icons/auth/icon-warn";

const Colors = {
  primaryBackground: "#222121",
  secondaryBackground: "#1D1D1D",
  textPrimary: "#C6C5C8",
  textSecondary: "#79767D",
  errorBackground: "#6C0516",
};

export default function QrAuthScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");

  return (
    <>
      <SafeAreaView style={[styles.safeAreaView, { backgroundColor: secondaryBackgroundColor }]}>
        <View style={styles.headerContainer}>
          <Image style={styles.logo} source={require("@/assets/images/logo-wide.png")} />
          <Image style={styles.qrScreenImage} source={require("@/assets/images/auth/qr-auth-screen.gif")} />
          <View style={styles.loginText}>
            <ThemedText type="display">Login to the App</ThemedText>
            <ThemedText type="bodyMedium2" style={styles.subText}>
              Explore Proposals on the go and add your vote!
            </ThemedText>
          </View>
        </View>

        <ThemedView type="background" style={styles.loginDescContainer}>
          <ThemedText type="bodyMedium2" style={styles.loginDescText}>1. Head To polkadot.polkassembly.io</ThemedText>
          <ThemedText type="bodyMedium2" style={styles.loginDescText}>2. Connect Wallet To Log In To Your Account</ThemedText>
          <ThemedText type="bodyMedium2" style={styles.loginDescText}>3. Scan QR To Log In To Mobile App</ThemedText>
          <ThemedButton textType="bodyLarge" text="Scan QR Code" onPress={() => setShowScanner(true)} />
        </ThemedView>
      </SafeAreaView>
      {showScanner && <QrCodeScanner />}
    </>
  );
}

const QrCodeScanner = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple scans
  const [permission, requestPermission] = useCameraPermissions();
  const { mutateAsync: claimSession, isError, error } = useQrAuth();
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { data } = scanningResult;
      if (!data) {
        setLoginError("QR Code is empty");
        return;
      }

      const parsedData = JSON.parse(data);
      const { sessionId, timestamp, expiresIn } = parsedData;

      if (!sessionId || !timestamp || !expiresIn) {
        setLoginError("Login failed, Invalid QR Code format");
        return;
      }

      if (Date.now() > timestamp + expiresIn * 1000) {
        setLoginError("Login failed, QR valid only for 5 mins");
        return;
      }

      await claimSession({ bodyParams: { sessionId } });

      if (isError) {
        setLoginError("Login failed");
        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
      setLoginError("Invalid QR Code");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.qrCodeScannerContainer}>
      <View style={styles.maskLayer} />
      <View style={styles.cameraViewContainer}>
        <Image style={styles.qrBoundary} source={require("@/assets/images/auth/qr-boundary.png")} />
        {permission?.granted ? (
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        ) : (
          <CameraViewSkeleton />
        )}
      </View>
      {loginError && <ErrorView content={loginError} />}
      {isProcessing &&
        <View style={{ position: 'absolute' }}>
          <ActivityIndicator size={100} color="#E5007A" />
        </View>
      }
    </View>
  );
};

const ErrorView = ({ content }: { content: string }) => (
  <View style={styles.error}>
    <IconWarn iconHeight={20} iconWidth={20} />
    <ThemedText>{content}</ThemedText>
  </View>
);

const CameraViewSkeleton = () => (
  <View style={styles.cameraViewContainer}>
    <Image style={styles.camera} source={require("@/assets/images/auth/qr-mock.jpeg")} />
  </View>
);

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  subText: {
    color: Colors.textSecondary,
  },
  qrCodeScannerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraViewContainer: {
    width: 350,
    height: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "92%",
    height: "95%",
  },
  logo: {
    width: 159,
    height: 51,
    resizeMode: "contain",
  },
  loginText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loginDescContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 24,
    gap: 24,
  },
  loginDescText: {
    backgroundColor: Colors.primaryBackground,
    color: Colors.textPrimary,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  qrScreenImage: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
  maskLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primaryBackground,
    opacity: 0.83,
  },
  error: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: Colors.errorBackground,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qrBoundary: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 1,
  },
});
