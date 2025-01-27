import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Image } from "expo-image";
import { router, Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";
import { url } from "../../util/url";
import auth from "../../util/auth";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

interface InfoCardProps {
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ label, value }) => (
  <View style={styles.card}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export default function PatientProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const redirect = useRouter();

  const fetchProfileData = async () => {
    try {
      const response = await auth("profile");
      setProfileData(response.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.setItem("token", "");
      redirect.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Update user avatar
  const updateAvatar = async () => {
    // Request image picker permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      // Create form data for upload
      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage.uri,
        type: "image/jpeg",
        name: "avatar-min.jpg",
      } as any);

      try {
        // Send upload request
        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(
          `${url}/api/update-user-avatar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle successful upload
        console.log("Avatar updated:", response.data);
        // Update profile data state to reflect the new avatar
        Alert.alert("Avatar updated", "User avatar updated successfully");
      } catch (error) {
        console.error("Avatar upload error:", error);
        Alert.alert(
          "Avatar upload error",
          "Failed to update avatar. Please try again later"
        );
      }
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfileData().finally(() => setRefreshing(false));
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={`${url}${profileData?.avatar}`}
            contentFit="cover"
            transition={1000}
          />
          <TouchableOpacity style={styles.updateIcon} onPress={updateAvatar}>
            <MaterialIcons
              name="add-a-photo"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>
          {profileData?.first_name} {profileData?.last_name}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <InfoCard label="Email" value={profileData?.email || ""} />

        <InfoCard label="Phone" value={profileData?.phone || ""} />

        <Link href="/(forms)/updateProfile" asChild>
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: Colors.secondary,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
    marginBottom: 15,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.white,
  },

  updateIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 20,
    color: Colors.secondary,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  updateButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  updateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  logoutText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});
