import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Skeleton } from "moti/skeleton";
import Toast from "react-native-toast-message";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

import { IconSettings } from "@/lib/components/icons/Profile";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useEditProfile } from "@/lib/net/queries/profile";

import defaultAvatar from "@/assets/images/profile/default-avatar.png";
import avatar0 from "@/assets/images/profile/avatar/avatar_0.png";
import avatar1 from "@/assets/images/profile/avatar/avatar_1.png";
import avatar2 from "@/assets/images/profile/avatar/avatar_2.png";
import avatar3 from "@/assets/images/profile/avatar/avatar_3.png";
import avatar4 from "@/assets/images/profile/avatar/avatar_4.png";
import avatar5 from "@/assets/images/profile/avatar/avatar_5.png";
import avatar6 from "@/assets/images/profile/avatar/avatar_6.png";
import IconPencil from "@/lib/components/icons/shared/icon-pencil";
import { Ionicons } from "@expo/vector-icons";
import { uploadImageToStorage } from "@/lib/net/api/uploadImageToStorage";
import { EditProfileParams } from "@/lib/net/queries/profile/useEditProfile";
import { useProfileStore } from "@/lib/store/profileStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Function to process and compress the image.
// It ensures that the resulting image is resized and compressed
// to try to fall within the 100–500 KB range.
async function processImageForUpload(image: string | number): Promise<string> {
  let uri: string;
  if (typeof image === "string") {
    uri = image;
  } else {
    const assetSource = Image.resolveAssetSource(image);
    if (assetSource?.uri) {
      if (assetSource.uri.startsWith("http")) {
        const fileUri = FileSystem.cacheDirectory + "temp-avatar.jpg";
        const { uri: downloadedUri } = await FileSystem.downloadAsync(
          assetSource.uri,
          fileUri
        );
        uri = downloadedUri;
      } else {
        const fileUri = FileSystem.cacheDirectory + "temp-avatar.jpg";
        await FileSystem.copyAsync({
          from: assetSource.uri,
          to: fileUri,
        });
        uri = fileUri;
      }
    } else {
      throw new Error("Asset URI not found");
    }
  }

  // Recursive function to compress the image.
  // It applies a resize (to a max width of 1024) and uses JPEG format.
  // If the file size is still above 500 KB, it decreases the quality.
  async function compressImage(
    currentUri: string,
    compress: number
  ): Promise<string> {
    const manipulatedResult = await ImageManipulator.manipulateAsync(
      currentUri,
      [{ resize: { width: 1024 } }], // resize to max width of 1024
      { compress, format: ImageManipulator.SaveFormat.JPEG }
    );
    const info = await FileSystem.getInfoAsync(manipulatedResult.uri);
    if (info.exists === false) {
      throw new Error("File does not exist");
    }

    const fileSize = info.size ?? 0;
    // If file is larger than 500KB and quality can be reduced further, try again.
    if (fileSize > 500 * 1024 && compress > 0.1) {
      return compressImage(currentUri, compress - 0.1);
    }
    return manipulatedResult.uri;
  }

  const finalUri = await compressImage(uri, 0.5);
  return finalUri;
}

export default function Settings() {
  // userProfilePicture can be a remote URI (string) or a local asset (number)
  const [userProfilePicture, setUserProfilePicture] = useState<string | number | null>(null);
  const [username, setUsername] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const userProfile = useProfileStore((state) => state.profile);

  const { mutate: editProfile } = useEditProfile();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username);
      setUserProfilePicture(userProfile.profileDetails.image || defaultAvatar);
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.centered}>
        <ThemedText>Failed to load user</ThemedText>
      </SafeAreaView>
    );
  }

  // Image Picker Logic
  async function handleUploadImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission needed",
        text2: "Permission to access gallery is required!",
      });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUserProfilePicture(uri);
    }
  }

  // Save profile data
  async function handleSave() {
    setIsSaving(true);
    try {
      let uploadedImageUrl: string | undefined;
      if (userProfile?.profileDetails?.image !== userProfilePicture && userProfilePicture) {
        const processedImageUri = await processImageForUpload(userProfilePicture);
        uploadedImageUrl = await uploadImageToStorage(processedImageUri);
      }
      const params = {} as EditProfileParams;
      if (username !== userProfile?.username) {
        params["username"] = username;
      }
      if (uploadedImageUrl) {
        params["image"] = uploadedImageUrl;
      }
      editProfile(params);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
      setIsSaving(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Failed to update profile",
      });
      setIsSaving(false);
    }
  }

  // Default avatars to choose from.
  const defaultAvatars = [
    defaultAvatar,
    avatar0,
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
  ];
  const colorStroke = useThemeColor({}, "mediumText");
  const backgroundColor = useThemeColor({}, "container");

  return (
    <>
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top}]}>
        <TopBar />
        <View style={{ gap: 32, paddingLeft: insets.left, paddingRight: insets.right }}>
          <View style={styles.header}>
            <IconSettings color="white" iconWidth={24} iconHeight={24} />
            <ThemedText type="titleMedium">Settings</ThemedText>
          </View>
          <View style={{ gap: 8, marginTop: 20 }}>
            <ThemedText type="bodySmall">USERNAME</ThemedText>
            {!userProfile ? (
              <Skeleton width={150} height={12} />
            ) : (
              <View style={styles.userNameContainer}>
                <TextInput
                  style={{ color: "white", flex: 1, fontSize: 16, padding: 8 }}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
                <IconPencil />
              </View>
            )}
          </View>
          <View style={{}}>
            <ThemedText type="bodySmall">PROFILE PICTURE</ThemedText>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ maxWidth: "48%", flex: 1, aspectRatio: 1 }}>
                <Image
                  source={
                    userProfilePicture
                      ? typeof userProfilePicture === "string"
                        ? { uri: userProfilePicture }
                        : Image.resolveAssetSource(userProfilePicture)
                      : Image.resolveAssetSource(defaultAvatar)
                  }
                  style={{ maxWidth: "100%", flex: 1, borderRadius: 100 }}

                />
              </View>
              <View style={{ width: "48%" }}>
                <ThemedText type="bodyMedium2" style={{ color: colorStroke }}>
                  Options:
                </ThemedText>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {defaultAvatars.slice(0, 3).map((avatar, index) => (
                    <AvatarButton
                      key={index}
                      avatarSource={avatar}
                      setAvatar={setUserProfilePicture}
                    />
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {defaultAvatars.slice(3, 6).map((avatar, index) => (
                    <AvatarButton
                      key={index}
                      avatarSource={avatar}
                      setAvatar={setUserProfilePicture}
                    />
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {defaultAvatars.slice(6, 8).map((avatar, index) => (
                    <AvatarButton
                      key={index}
                      avatarSource={avatar}
                      setAvatar={setUserProfilePicture}
                    />
                  ))}
                  <View style={styles.avatarButton}>
                    <TouchableOpacity onPress={handleUploadImage}>
                      <Ionicons name="camera" color="white" size={25} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <ThemedButton text={isSaving ? "Saving..." : "Save"} onPress={handleSave} />
        </View>
      </View>
      {isSaving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <ThemedText>Saving profile...</ThemedText>
        </View>
      )}
    </>
  );
}

interface AvatarButtonProps {
  avatarSource: any;
  setAvatar: (avatar: string | number) => void;
}

function AvatarButton({ avatarSource, setAvatar }: AvatarButtonProps) {
  return (
    <TouchableOpacity onPress={() => setAvatar(avatarSource)} style={styles.avatarButton}>
      <Image
        source={
          typeof avatarSource === "string"
            ? { uri: avatarSource }
            : Image.resolveAssetSource(avatarSource)
        }
        style={styles.avatarImage}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
  },
  userNameContainer: {
    borderWidth: 1,
    borderColor: "#383838",
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  profilePictureContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    flex: 1,
    flexGrow: 1,
    aspectRatio: 1,
  },
  avatarImage: {
    width: "90%",
    height: "90%",
    borderRadius: 20,
  },
  savingOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});