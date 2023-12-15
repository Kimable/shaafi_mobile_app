import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors from "../../constants/Colors";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../url";
import auth from "../auth";
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
      const response = await fetch(`${url}/api/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          email,
          phone,
        }),
      });
      if (response.status === 201) {
        let data = await response.json();
        await AsyncStorage.setItem("token", data.token);
        alert("Profile Update successful!");
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
    <>
      {user === null ? (
        <Text style={globalStyles.loading}>Loading...</Text>
      ) : (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.form}>
              <Text style={styles.title}>Update Profile</Text>
              <Text style={styles.label}>First Name:</Text>
              <TextInput
                style={styles.input}
                placeholder={user.first_name}
                onChangeText={setFirstName}
              />
              <Text style={styles.label}>Middle Name:</Text>
              <TextInput
                style={styles.input}
                placeholder={
                  !user.middle_name ? "Middle Name" : user.middle_name
                }
                onChangeText={setMiddleName}
              />
              <Text style={styles.label}>Last Name:</Text>
              <TextInput
                style={styles.input}
                placeholder={user.last_name}
                onChangeText={setLastName}
              />
              <Text style={styles.label}>Phone No:</Text>
              <TextInput
                style={styles.input}
                placeholder={user.phone}
                onChangeText={setPhone}
              />
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                editable={false}
                value={user.email}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
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
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: 300,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 15,
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
  label: {
    fontSize: 13,
    marginTop: 10,
    marginLeft: 12,
    color: Colors.secondary,
  },
});
