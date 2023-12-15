import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../../constants/Colors";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../url";

const registration = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!firstName || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }
    function isValidEmail(email: string) {
      // Regular expression pattern for a valid email address
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return emailPattern.test(email);
    }
    if (isValidEmail(email)) {
      console.log("Valid email address");
    } else {
      alert("Invalid email address");
      return;
    }
    try {
      const response = await fetch(`${url}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password,
        }),
      });
      if (response.status === 201) {
        let data = await response.json();
        await AsyncStorage.setItem("token", data.token);
        alert("Registration successful!");
        router.replace("/(patient)/");
      } else if (response.status === 401) {
        let data = await response.json();
        alert(data.errorMsg);
        console.log(data);
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      alert("Something went wrong! Please try again.");
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Link style={styles.text} href="/login">
          <Text>Already registered? Login Here</Text>
        </Link>
      </View>
    </View>
  );
};

export default registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: 300,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },

  text: {
    color: Colors.secondary,
    marginTop: 12,
    fontSize: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "bold",
  },
});
