import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../util/url";
import auth from "../../util/auth";
import globalStyles from "../../constants/GlobalStyles";

const updateProfile = () => {
  const router = useRouter();
  const [user, setUser]: any = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await auth("profile");
      setUser(data.user);
      console.log(data);
    }
    fetchData();
  }, []);

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const response = await fetch(`${url}/api/update-profile`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          email,
          phone,
        }),
      });
      let data = await response.json();
      if (response.status === 201) {
        console.log(data);
        Alert.alert("Success", "Profile Update successful!");
        router.replace("/(patient)/profile");
      }
      if (response.status === 401) {
        let data = await response.json();
        alert(data.errorMsg);
        console.log(data);
      }
      console.log(data);
    } catch (error) {
      Alert.alert("Error 2", "Something went wrong! Please try again.");
      console.log(error);
    }
  };
  return (
    <>
      {user === null ? (
        <View style={globalStyles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.form}>
              <Text style={styles.title}>Update Profile</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder={user.first_name}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Middle Name</Text>
                <TextInput
                  style={styles.input}
                  value={middleName}
                  onChangeText={setMiddleName}
                  placeholder={user.middle_name || "Middle Name"}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder={user.last_name}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder={user.phone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user.email}
                  editable={false}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default updateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  form: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 8,
    color: "#666",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
