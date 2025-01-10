import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../constants/Colors";
import globalStyles from "../../constants/GlobalStyles";
import { url } from "../../util/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";

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

  const onDateChange = (date: any) => {
    if (date) {
      setDate(date);
    }
  };

  return (
    <>
      {doctors === null ? (
        <Text style={globalStyles.loading}>Loading...</Text>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <Text style={globalStyles.title}>Book Appointment</Text>

            {/* Calender */}
            <Text style={[styles.label, { marginBottom: 5 }]}>
              Select Date:
            </Text>
            <View>
              <CalendarPicker
                // Basic settings
                onDateChange={onDateChange}
                selectedStartDate={date}
                width={320}
                // Customizing colors
                selectedDayColor={Colors.primary}
                selectedDayTextColor="#FFFFFF"
                todayBackgroundColor="#E6E6E6"
                todayTextStyle={{ color: Colors.tertiary }}
                // Header styling
                monthTitleStyle={{
                  color: "#000",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
                yearTitleStyle={{
                  color: "#000",
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
                  color: "#000000",
                }}
                // Restrictions
                minDate={new Date()} // Can't select past dates
                maxDate={new Date(2025, 6, 3)} // Can't select dates after July 3, 2025
                // Disable specific dates or weekends
                //disabledDates={["2024-01-19"]} // Specific dates
                //disabledDaysOfWeek={[0, 6]} // Sundays and Saturdays
                // Custom previous/next buttons
                previousComponent={
                  <EvilIcons name="chevron-left" size={30} color="#666" />
                }
                nextComponent={
                  <EvilIcons name="chevron-right" size={30} color="#666" />
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
  container: {
    padding: 15,
    backgroundColor: "#fff",
    margin: 13,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
    color: Colors.tertiary,
  },
  datePicker: {
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    color: "#666",
    height: 40,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 5,
    marginTop: 5,
    color: "#0c0c0c",
  },
  description: {
    marginBottom: 18,
    height: 150, // Set a fixed height or adjust as needed
    textAlignVertical: "top", // Makes text start from the top
    padding: 10,
    lineHeight: 24,
  },
  pickerItem: {
    borderColor: "#666",
    borderWidth: 1,
  },

  picker: {
    color: "#666",
    fontSize: 13,
  },
});
