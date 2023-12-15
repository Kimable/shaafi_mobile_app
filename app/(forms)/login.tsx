import { Link, useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import globalStyle from "../../constants/GlobalStyles";
import { url } from "../url";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const response = await fetch(`${url}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.status === 200) {
      // Login successful!
      let data = await response.json();
      await AsyncStorage.setItem("token", data.token);
      alert("Login Success!");
      router.replace("/(patient)/");
    } else if (response.status === 401) {
      let data = await response.json();
      alert(data.errorMsg);
    } else {
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={globalStyle.form}>
        <Text style={globalStyle.title}>Login</Text>
        <TextInput
          onChangeText={setEmail}
          style={globalStyle.input}
          placeholder="Email"
        />
        <TextInput
          onChangeText={setPassword}
          style={globalStyle.input}
          secureTextEntry={true}
          placeholder="Password"
        />
        <TouchableOpacity style={globalStyle.button} onPress={handleSubmit}>
          <Text style={globalStyle.buttonText}>Login</Text>
        </TouchableOpacity>
        <Link style={styles.text} href="/registration">
          <Text>Not registered? Register Here</Text>
        </Link>
      </View>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  text: {
    color: Colors.secondary,
    marginTop: 12,
    fontSize: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
});
