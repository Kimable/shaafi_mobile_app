import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import globalStyles from "../../constants/GlobalStyles";
import { useRouter } from "expo-router";
import auth from "../auth";
import Colors from "../../constants/Colors";
import { openURL } from "expo-linking";
import { url } from "../url";
import { openBrowserAsync } from "expo-web-browser";

const Payments = () => {
  // const [data, setData]: any = useState(null);

  // const redirect = useRouter();

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await auth("profile");
  //     setData(data.user);
  //     console.log(data);
  //   }
  //   fetchData();
  // }, []);
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Make Payments</Text>
      <Text style={globalStyles.boldText}>Payment options Coming soon</Text>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.white,
    textTransform: "uppercase",
  },
  form: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 12,
  },
  input: {
    borderRadius: 5,
    padding: 13,
  },

  text: {
    color: "red",
    marginBottom: 15,
  },
});
