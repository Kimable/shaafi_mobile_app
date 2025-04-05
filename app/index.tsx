import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Colors from "../constants/Colors";
import logo from "../assets/images/landing.png";
import globalStyles from "../constants/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Language Translation
import { I18nManager } from "react-native";
import i18n from "./i18n";
import LangSelection from "../components/LangSelection";

const LandingScreen = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const isRTL = i18n.locale === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      // You may need to reload the app here to apply RTL correctly
    }
  }, [i18n.locale]);

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        let tkn = await AsyncStorage.getItem("token");
        setToken(tkn);
        console.log(tkn);
      } catch (error) {
        console.error("Failed to fetch token:", error);
        setToken(null);
      }
    };
    isLoggedIn();
  }, []);

  return !token ? <GetStartedScreen /> : <Redirect href="/home" />;
};

export default LandingScreen;

const GetStartedScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[globalStyles.container, styles.container]}>
        <LangSelection />
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={logo} />
        </View>
        <View style={styles.container}>
          <Text style={{ color: Colors.secondary, fontWeight: "bold" }}>
            {i18n.t("Experience exceptional healthcare!")}
          </Text>
          <Link href="/(forms)/login" style={styles.btn} asChild>
            <Pressable>
              <Text style={styles.btnText}>{i18n.t("Login to Continue")}</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
    margin: 20,
    borderRadius: 6,
  },

  btnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    lineHeight: 21,
  },

  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  imgContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 400,
    height: 250,
  },
});
