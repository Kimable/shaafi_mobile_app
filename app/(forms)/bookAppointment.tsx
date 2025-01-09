import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../constants/Colors";
import globalStyles from "../../constants/GlobalStyles";
import { url } from "../../util/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

const bookAppointment = () => {
  const router = useRouter();
  const [doctors, setDoctors]: any = useState(null);

  useEffect(() => {
    axios
      .get(`${url}/api/doctors`)
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [gender, setGender] = useState("");
  const [medicalConcern, setMedicalConcern] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAppointmentSubmit = async () => {
    if (!date || !time || !gender) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const response = await fetch(`${url}/api/book-appointment`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          date: date.toDateString(),
          time,
          gender,
          medical_issue: medicalConcern,
          description,
          booked_doctor_id: doctor,
        }),
      });
      if (response.status === 201) {
        alert("Your Appointment has been Booked successfully!");
        router.replace("/(patient)/dashboard");
      } else if (response.status === 401 || response.status === 500) {
        let data = await response.json();
        alert(data.errorMsg);
      } else {
        alert("The booking wasn't successfull! Try again.");
      }
    } catch (error) {
      alert("Something went wrong! Try again later");
    }
  };

  const onDateChange = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setShowDatePicker(false);
      setDate(selectedDate);
    }
  };

  return (
    <>
      {doctors === null ? (
        <Text style={globalStyles.loading}>Loading...</Text>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <Text style={[globalStyles.title, styles.title]}>
              Book Appointment
            </Text>
            <Text style={styles.label}>Date:</Text>
            <TextInput
              style={styles.input}
              value={date.toDateString()} // Display the selected date as a string
              onFocus={() => setShowDatePicker(true)} // Show the date picker when the input is focused
            />
            {showDatePicker && (
              <RNDateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <Text style={styles.label}>Time:</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={(text) => setTime(text)}
            />

            <Text style={styles.label}>Preferred Doctor:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={doctor}
                itemStyle={styles.pickerItem}
                dropdownIconColor="white"
                onValueChange={(itemValue: any) => setDoctor(itemValue)}
              >
                <Picker.Item label="Select Doctor" value="" />
                {doctors.map((doctor: any) => {
                  return (
                    <Picker.Item
                      key={doctor.user.id}
                      label={`Dr. ${doctor.user.first_name} (${doctor.specialty})`}
                      value={doctor.user.id}
                    />
                  );
                })}
              </Picker>
            </View>

            <Text style={styles.label}>Gender:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={gender}
                itemStyle={styles.pickerItem}
                dropdownIconColor="white"
                onValueChange={(itemValue: any) => setGender(itemValue)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <Text style={styles.label}>Medical Concern:</Text>
            <TextInput
              style={styles.input}
              value={medicalConcern}
              onChangeText={(text) => setMedicalConcern(text)}
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.description]}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />

            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleAppointmentSubmit}
            >
              <Text style={globalStyles.buttonText}>Submit Appointment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default bookAppointment;

const styles = StyleSheet.create({
  title: { color: "#fff", textTransform: "uppercase" },
  container: {
    padding: 40,
    backgroundColor: Colors.tertiary,
    margin: 13,
    borderRadius: 10,
  },
  label: {
    fontSize: 13,
    marginTop: 10,
    color: "#fff",
  },
  datePicker: {
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    color: "#fff",
    height: 40,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    marginTop: 5,
    color: "#fff",
  },
  description: {
    marginBottom: 18,
    height: 150, // Set a fixed height or adjust as needed
    textAlignVertical: "top", // Makes text start from the top
    padding: 10,
    lineHeight: 24,
  },
  pickerItem: {
    borderColor: "#fff",
    borderWidth: 1,
  },

  picker: {
    color: "#fff",
    fontSize: 13,
  },
});
