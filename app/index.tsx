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

const LandingScreen = () => {
  const [token, setToken] = useState<any | null>("");

  useEffect(() => {
    const isLoggedIn = async () => {
      let tkn = await AsyncStorage.getItem("token");
      setToken(tkn);
      console.log(token);
    };
    isLoggedIn();
  }, [token]);

  return token === "" || token === null ? (
    <GetStartedScreen />
  ) : (
    <Redirect href="/home" />
  );
};
export default LandingScreen;

const GetStartedScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[globalStyles.container, styles.container]}>
        <View style={styles.imgContainer}>
          <Image style={styles.image} source={logo} />
        </View>
        <View style={styles.container}>
          <Text style={{ color: Colors.secondary, fontWeight: "bold" }}>
            Experience exceptional healthcare!
          </Text>
          <Link href="/(forms)/login" asChild>
            <Pressable style={styles.btn}>
              <Text style={styles.btnText}>Login to Continue</Text>
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
