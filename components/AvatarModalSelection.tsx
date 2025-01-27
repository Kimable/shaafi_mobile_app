import React, { useState } from "react";
import { View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Button, Text } from "react-native-paper"; // Recommended UI library
import { url } from "../util/url";

interface AvatarSelectionModalProps {
  url: string;
  profileData: { avatar: string };
  onAvatarUpdate: (data: any) => void;
}

const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
  profileData,
  onAvatarUpdate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async (mode: string) => {
    let result;
    try {
      if (mode === "camera") {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Image selection error:", error);
    }
  };

  const uploadAvatar = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("avatar", {
      name: selectedImage.fileName || "avatar.jpg",
      type: selectedImage.type || "image/jpeg",
      toString: () => selectedImage.uri,
    } as any);

    try {
      const response = await axios.post(
        `${url}/api/update-user-avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onAvatarUpdate(response.data);
      setModalVisible(false);
    } catch (error) {
      console.error("Avatar upload error:", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => pickImage("library")}>
        <Image
          source={`${url}/storage${profileData?.avatar}`}
          style={styles.avatar}
        />
        <View style={styles.editIconOverlay}>
          <Text style={styles.editIconText}>Edit</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile Picture</Text>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
              />
            )}

            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={uploadAvatar}>
                Upload
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)}>
                Cancel
              </Button>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => pickImage("camera")}
              >
                <Text>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => pickImage("library")}
              >
                <Text>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  editIconText: {
    color: "white",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  optionButton: {
    padding: 10,
  },
});

export default AvatarSelectionModal;
