import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../app/i18n";

const CompactLanguageSelector = () => {
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLocale");
        if (savedLocale) {
          i18n.locale = savedLocale;
          setCurrentLocale(savedLocale);
        }
      } catch (error) {
        console.error("Failed to load language preference", error);
      }
    };
    loadLocale();
  }, []);

  const changeLanguage = async (locale: any) => {
    try {
      await AsyncStorage.setItem("userLocale", locale);
      i18n.locale = locale;
      setCurrentLocale(locale);
      setModalVisible(false);

      // If switching to/from Arabic, you might need to restart the app
      // for RTL changes to take full effect
      if (
        (locale === "ar" && currentLocale !== "ar") ||
        (locale !== "ar" && currentLocale === "ar")
      ) {
        // Alert user they need to restart the app
        alert(
          "Please restart the app for the language change to take full effect"
        );
      }
    } catch (error) {
      console.error("Failed to save language preference", error);
    }
  };

  // Map locale codes to display names and flag emojis
  const languageOptions: any = {
    en: { name: "English", flag: "🇺🇸", shortName: "EN" },
    ar: { name: "العربية", flag: "🇸🇦", shortName: "AR" },
    so: { name: "Soomaali", flag: "🇸🇴", shortName: "SO" },
  };

  return (
    <View style={styles.container}>
      {/* Compact button to open language selector */}
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.languageButtonText}>
          {languageOptions[currentLocale].flag}{" "}
          {languageOptions[currentLocale].shortName}
        </Text>
      </TouchableOpacity>

      {/* Language selection modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {i18n.t("selectLanguage", { defaultValue: "Select Language" })}
            </Text>

            {Object.keys(languageOptions).map((locale) => (
              <TouchableOpacity
                key={locale}
                style={[
                  styles.languageOption,
                  currentLocale === locale && styles.selectedLanguage,
                ]}
                onPress={() => changeLanguage(locale)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    currentLocale === locale && styles.selectedLanguageText,
                  ]}
                >
                  {languageOptions[locale].flag} {languageOptions[locale].name}
                </Text>
                {currentLocale === locale && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>
                {i18n.t("close", { defaultValue: "Close" })}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 10,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedLanguage: {
    backgroundColor: "#007bff",
  },
  languageOptionText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    color: "white",
    fontWeight: "500",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontWeight: "500",
  },
});

export default CompactLanguageSelector;
