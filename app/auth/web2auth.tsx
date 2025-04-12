import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { ThemedView } from "@/lib/components/shared/View";
import { ThemedText } from "@/lib/components/shared/text";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ThemedButton } from "@/lib/components/shared/button";
import { Ionicons } from "@expo/vector-icons";
import { ThemedCheckbox, ThemedTextInput } from "@/lib/components/shared";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useWeb2Login } from "@/lib/net/queries/auth";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import ForgotPassword from "@/lib/components/auth/ForgotPassword";

const Colors = {
  primaryBackground: "#222121",
  textPrimary: "#C6C5C8",
  textSecondary: "#79767D",
  errorBackground: "#6C0516",
};

export default function Web2Auth() {
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { mutateAsync: login, isPending } = useWeb2Login();
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function onPressLogin() {
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (hasError) return;

    try {
      await login({ emailOrUsername: email, password });
      router.dismissAll();
      router.replace("/(tabs)");
    } catch (e) {
      console.error(e);
      if (e instanceof AxiosError) {
        console.error(e.response?.data);
      }
      // Optional: show toast or inline error
    }
  }

  const handleForgotPassword = () => {
    openBottomSheet(<ForgotPassword onClose={closeBottomSheet} />);
  };

  const accentColor = useThemeColor({}, "accent");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView type="secondaryBackground" style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          {!keyboardVisible && (
            <>
              <Image
                style={styles.logo}
                source={require("@/assets/images/logo-wide.png")}
              />
              <Image
                style={{ flexGrow: 0.8, flexBasis: 0 }}
                resizeMode="contain"
                source={require("@/assets/images/auth/qr-auth-screen.gif")}
              />
            </>
          )}

          <View style={styles.loginText}>
            <ThemedText type="display">Login to the App</ThemedText>
            <ThemedText type="bodyMedium2" colorName="mediumText">
              Explore Proposals on the go and add your vote!
            </ThemedText>
          </View>
        </View>

        <Link
          href="/auth/loginOptionsScreen"
          style={{ paddingLeft: 24, paddingBottom: 16 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="arrow-back" size={16} color={accentColor} />
            <ThemedText type="bodyMedium2" colorName="accent">
              Go Back
            </ThemedText>
          </View>
        </Link>

        <ThemedView type="background" style={styles.loginDescContainer}>
          <ThemedTextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
            errorText={emailError}
            label="Email or Username"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ThemedTextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
            errorText={passwordError}
            label="Password"
            password
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedCheckbox
              value={rememberMeChecked}
              onValueChange={setRememberMeChecked}
              label="Remember me"
            />

            <ThemedButton
              borderless
              text="Forgot Password?"
              onPress={handleForgotPassword}
            />
          </View>

          <ThemedButton
            onPress={onPressLogin}
            text="Log In"
            textType="buttonLarge"
            disabled={isPending}
            loading={isPending}
          />
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

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
    padding: 24,
    gap: 16,
  },
});
