import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../app/i18n";
import globalStyles from "../constants/GlobalStyles";
import Colors from "../constants/Colors";

function LanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState(i18n.locale);

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

      // If switching to/from Arabic, you might need to restart the app
      // for RTL changes to take effect fully
      if (locale === "ar" || currentLocale === "ar") {
        // Alert user they need to restart the app
        alert(
          "Please restart the app for the language change to take full effect"
        );
      }
    } catch (error) {
      console.error("Failed to save language preference", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("selectLanguage")}</Text>
      <TouchableOpacity
        style={[styles.button, currentLocale === "en" && styles.selectedButton]}
        onPress={() => changeLanguage("en")}
      >
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, currentLocale === "ar" && styles.selectedButton]}
        onPress={() => changeLanguage("ar")}
      >
        <Text style={styles.buttonText}>العربية</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, currentLocale === "so" && styles.selectedButton]}
        onPress={() => changeLanguage("so")}
      >
        <Text style={styles.buttonText}>Soomaali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: Colors.tertiary,
  },
  buttonText: {
    textAlign: "center",
  },
});

export default LanguageSelector;
