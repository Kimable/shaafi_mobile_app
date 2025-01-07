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
import { url } from "../../util/url";
import { Link, useRouter } from "expo-router";
import { Avatar } from "react-native-paper";

const onlineConsultation = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [medicalIssue, setMedicalIssue] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    // const response = await fetch(`${url}/api/online-consult`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     time,
    //     date,
    //   }),
    // });
    // if (response.status === 200) {

    //   let data = await response.json();

    //   alert("Login Success!");
    //   router.replace("/(patient)/");
    // } else if (response.status === 401) {
    //   let data = await response.json();
    //   alert(data.errorMsg);
    // } else {
    //   alert("Something went wrong! Please try again.");
    // }
    console.log(date, time, medicalIssue);
    alert(
      "Congrats! You've successfully booked an online consultation. We will get back to you shortly with zoom credentials"
    );
  };
  return (
    <View style={styles.container}>
      <View style={[globalStyle.form, { backgroundColor: Colors.secondary }]}>
        <Avatar.Icon
          icon="video"
          size={40}
          style={{
            backgroundColor: Colors.primary,
            marginBottom: 6,
            alignSelf: "center",
          }}
        />
        <Text style={[globalStyle.title, { color: "#fff" }]}>
          Book An Online Consultation
        </Text>
        <TextInput
          onChangeText={setDate}
          style={[globalStyle.input, styles.input]}
          placeholder="Date"
        />
        <TextInput
          onChangeText={setTime}
          style={[globalStyle.input, styles.input]}
          placeholder="Time"
        />
        <TextInput
          onChangeText={setMedicalIssue}
          style={[globalStyle.input, styles.input]}
          placeholder="Describe medical Issue"
        />
        <TouchableOpacity style={globalStyle.button} onPress={handleSubmit}>
          <Text style={globalStyle.buttonText}>Book Consultation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default onlineConsultation;

const styles = StyleSheet.create({
  text: {
    color: Colors.secondary,
    marginTop: 12,
    fontSize: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontWeight: "bold",
    backgroundColor: "#fff",
  },
});
