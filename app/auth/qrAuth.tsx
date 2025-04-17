import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import useQrAuth from "@/lib/net/queries/auth/useQrAuth";
import { Link, useRouter } from "expo-router";
import { ThemedView } from "@/lib/components/shared/View";
import { useState, useEffect } from "react";
import { ThemedText } from "@/lib/components/shared/text";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ThemedButton } from "@/lib/components/shared/button";
import IconWarn from "@/lib/components/icons/auth/icon-warn";
import { Ionicons } from "@expo/vector-icons";
import { IconExternalLink } from "@/lib/components/icons/auth";

const Colors = {
  primaryBackground: "#222121",
  textPrimary: "#C6C5C8",
  textSecondary: "#79767D",
  errorBackground: "#6C0516",
};

export default function QrAuthScreen() {
  const [showScanner, setShowScanner] = useState(false);
  const accentColor = useThemeColor({}, "accent");

  return (
    <>
      <ThemedView type="secondaryBackground" style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <Image style={styles.logo} source={require("@/assets/images/logo-wide.png")} />
          <Image style={{ flexGrow: 0.8, flexBasis: 0 }} resizeMode="contain" source={require("@/assets/images/auth/qr-auth-screen.gif")} />
          <View style={styles.loginText}>
            <ThemedText type="display">Scan QR</ThemedText>
            <ThemedText type="bodyMedium2" colorName="mediumText" style={{ paddingHorizontal: 42, textAlign: "center" }}>
              Connect to your Polkassembly account through web login
            </ThemedText>
          </View>
        </View>
        <Link href="/auth/loginOptionsScreen" style={{ paddingLeft: 24, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="arrow-back" size={16} color={accentColor} />
            <ThemedText type="bodyMedium2" colorName="accent">Go Back</ThemedText>
          </View>
        </Link>

        <ThemedView type="background" style={styles.loginDescContainer}>
          <ThemedText type="bodyMedium2" style={styles.loginDescText}>1. Log In to your Polkassembly account on Desktop</ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: Colors.primaryBackground }}>
            <ThemedText type="bodyMedium2" style={[styles.loginDescText, { paddingRight: 4 }]}>2. Head to Profile</ThemedText>
            <Ionicons name='arrow-forward' size={16} color={Colors.textPrimary} />
            <ThemedText type="bodyMedium2" style={[styles.loginDescText, { paddingLeft: 4 }]}>Mobile Login</ThemedText>
          </View>
          <ThemedText type="bodyMedium2" style={styles.loginDescText}>3. Scan QR To Log In To Mobile App</ThemedText>
          <ThemedButton textType="bodyLarge" text="Scan QR Code" onPress={() => setShowScanner(true)} />
        </ThemedView>
      </ThemedView>
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

      await claimSession({ sessionId });

      if (isError) {
        setLoginError("Login failed");
        return;
      }
      router.dismissAll();
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
    flex: 1,
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
    width: 160,
    height: 50,
    resizeMode: "contain",
  },
  loginText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loginDescContainer: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  loginDescText: {
    backgroundColor: Colors.primaryBackground,
    color: Colors.textPrimary,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  qrScreenImage: {
    flexGrow: 1,
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
