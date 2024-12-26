import IconBack from "@/components/icons/icon-back";
import Tabs from "@/components/shared/Tabs";
import ThemedCheckbox from "@/components/shared/ThemedCheckbox";
import ThemedTextInput from "@/components/shared/ThemedTextInput";
import ThemedButton, { ThemedButtonProps } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

export default function Web2AuthScreen() {
  const navigate = useNavigation();

  const backgroundColor = useThemeColor({}, "secondaryBackground");

  return (
    <SafeAreaView style={[styles.root, { backgroundColor }]}>
      <Header />

      <ThemedButton
        borderless
        style={styles.backButton}
        onPress={() => navigate.goBack()}
      >
        <IconBack />
        <ThemedText colorName="accent">Go back</ThemedText>
      </ThemedButton>

      <Content />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/logo-wide.png")}
      />

      <ThemedText type="display" style={styles.title}>
        Get Started now
      </ThemedText>

      <ThemedText style={styles.title} colorName="mediumText">
        Create an account or log in to explore about our app
      </ThemedText>
    </View>
  );
}

const tabs = [
  { id: "login" as const, label: "Log in" },
  { id: "signup" as const, label: "Sign up" },
];

function Content() {
  const [selectedTab, setSelectedTab] = useState<"login" | "signup">("login");

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Tabs tabs={tabs} selectedTab={selectedTab} onChange={setSelectedTab} />
      {selectedTab === "login" ? <Login /> : <Signup />}
    </ScrollView>
  );
}

function Login() {
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  return (
    <>
      <ThemedTextInput label="Email" textContentType="emailAddress" />
      <ThemedTextInput label="Password" password />

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

        <ThemedButton borderless text="Forgot Password?" />
      </View>

      <ThemedButton text="Log In" textType="buttonLarge" />

      <Or />

      <GoogleSignInButton />
    </>
  );
}

function Signup() {
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  return (
    <>
      <ThemedTextInput label="Email" textContentType="emailAddress" />
      <ThemedTextInput
        label="Password"
        password
        textContentType="newPassword"
      />

      <ThemedCheckbox
        value={rememberMeChecked}
        onValueChange={setRememberMeChecked}
        label="Remember me"
      />

      <ThemedButton text="Sign Up" textType="buttonLarge" />

      <Or />

      <GoogleSignInButton />
    </>
  );
}

function GoogleSignInButton(props: ThemedButtonProps) {
  return (
    <ThemedButton
      {...props}
      style={[
        {
          backgroundColor: Colors.dark.background,
          borderWidth: 1,
          borderColor: Colors.dark.ctaStroke,
        },
        props.style,
      ]}
    >
      <Image source={require("@/assets/images/icon-google.png")} />

      <ThemedText type="buttonLarge" colorName="mediumText">
        Continue with Google
      </ThemedText>
    </ThemedButton>
  );
}

function Or() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Separator style={{ flex: 1 }} />

      <ThemedText type="bodySmall1" colorName="mediumText">
        Or
      </ThemedText>

      <Separator style={{ flex: 1 }} />
    </View>
  );
}

function Separator({ style, ...props }: ViewProps) {
  const color = useThemeColor({}, "mediumText");

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderTopColor: color,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },

  header: {
    flexDirection: "column",
    marginInline: 16,
    marginTop: 16,
    alignItems: "flex-start",
  },
  logo: {
    marginBottom: 18,
    height: 51,
    width: 159,
  },
  title: {
    marginBottom: 12,
  },

  backButton: {
    marginBlock: 8,
    marginInline: 16,
    alignSelf: "flex-start",
  },

  content: {
    flex: 1,
    flexDirection: "column",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 14,
    gap: 16,
    backgroundColor: Colors.dark.background,
  },
});
