import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import globalStyle from "../../constants/GlobalStyles";
import { url } from "../../util/url";
import { useRouter } from "expo-router";
import { Avatar } from "react-native-paper";
import { EvilIcons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import globalStyles from "../../constants/GlobalStyles";

const onlineConsultation = () => {
  // Fetch and set Doctors
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
  const [medicalIssue, setMedicalIssue] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    if (!date) {
      Alert.alert("Empty Date", "Please select a date");
      return;
    }
    if (!time) {
      Alert.alert("Empty time", "Please select a time");
      return;
    }
    if (!doctor) {
      Alert.alert("Empty doctor", "Please select a doctor");
      return;
    }
    if (!medicalIssue) {
      Alert.alert("Empty Medical Concern", "Please write a Medical Concern");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const response = await fetch(`${url}/api/book-video-consult`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          date: date.toDateString(),
          time,
          medical_issue: medicalIssue,
          booked_doctor_id: doctor,
        }),
      });
      if (response.status === 201) {
        Alert.alert(
          "Success",
          "Congrats! You've successfully booked a video consultation. Check your email for details."
        );
        router.replace("/(patient)/dashboard");
      } else if (response.status === 401 || response.status === 500) {
        let data = await response.json();
        Alert.alert("Error", "Something went wrong! Try again later");
      } else {
        Alert.alert("Error", "The booking wasn't successfull! Try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong! Try again later");
    }
  };

  const onDateChange = (date: any) => {
    if (date) {
      setDate(date);
    }
  };
  return (
    <>
      {doctors === null ? (
        <View style={globalStyles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Avatar.Icon
              icon="video"
              size={40}
              style={{
                backgroundColor: Colors.primary,
                marginBottom: 6,
                alignSelf: "center",
              }}
            />
            <Text
              style={[globalStyle.title, { color: "#fff", marginBottom: 20 }]}
            >
              Book A Video Consultation
            </Text>
            {/* Calender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Date</Text>
              <CalendarPicker
                // Basic settings
                onDateChange={onDateChange}
                selectedStartDate={date}
                width={320}
                // Customizing colors
                selectedDayColor={Colors.primary}
                selectedDayTextColor="#FFFFFF"
                todayBackgroundColor="#000"
                todayTextStyle={{ color: "#fff" }}
                // Header styling
                monthTitleStyle={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
                yearTitleStyle={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
                // Day names styling
                dayLabelsWrapper={{
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                }}
                weekdays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                textStyle={{
                  fontFamily: "Arial",
                  color: "#fff",
                }}
                // Restrictions
                minDate={new Date()} // Can't select past dates
                maxDate={new Date(2025, 6, 3)} // Can't select dates after July 3, 2025
                // Disable specific dates or weekends
                //disabledDates={["2024-01-19"]} // Specific dates
                //disabledDaysOfWeek={[0, 6]} // Sundays and Saturdays
                // Custom previous/next buttons
                previousComponent={
                  <EvilIcons name="chevron-left" size={30} color="#f1f1f1" />
                }
                nextComponent={
                  <EvilIcons name="chevron-right" size={30} color="#f1f1f1" />
                }
                // Additional options
                allowRangeSelection={false} // Set to true if you want date range selection
                scrollable={true} // Enable month scrolling
                horizontal={true} // Horizontal scrolling
                // Customize date number style
                customDatesStyles={[
                  {
                    date: new Date(2024, 0, 15), // January 15, 2024
                    style: { backgroundColor: "#ffddf4" },
                    textStyle: { color: "#700f57" },
                  },
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM AM/PM"
                value={time}
                onChangeText={setTime}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Doctor</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={doctor}
                  onValueChange={setDoctor}
                >
                  <Picker.Item label="Select Doctor" value="" />
                  {doctors.map((doctor: any) => (
                    <Picker.Item
                      key={doctor.user.id}
                      label={`Dr. ${doctor.user.first_name} (${doctor.specialty})`}
                      value={doctor.user.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medical Issue</Text>
              <TextInput
                style={[styles.input, styles.description]}
                multiline
                numberOfLines={4}
                placeholder="Provide more details about your medical concern"
                value={medicalIssue}
                onChangeText={setMedicalIssue}
              />
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={globalStyle.buttonText}>Book Consultation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f7",
  },
  container: {
    padding: 20,
    backgroundColor: Colors.tertiary,
    margin: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    color: Colors.secondary,
    marginVertical: 12,
    fontSize: 10,
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    color: "#333",
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  description: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 15,
    lineHeight: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "white",
  },
  picker: {
    color: "#333",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default onlineConsultation;
