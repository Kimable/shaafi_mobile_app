// Add a single doctor screen
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import CalendarPicker from "react-native-calendar-picker";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import globalStyles from "../../../constants/GlobalStyles";
import { Image } from "expo-image";
import { url } from "../../../util/url";
import axios from "axios";
import Colors from "../../../constants/Colors";
import { Link, useLocalSearchParams } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  doctor: {
    specialty: string;
  };
}

const SingleDoctor = () => {
  const router = useRouter();
  // Getting doctor
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking appointment
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [gender, setGender] = useState("");
  const [medicalConcern, setMedicalConcern] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Getting Doctor
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axios
      .get(`${url}/api/doctor/${id}`)
      .then((response) => {
        setDoctor(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctor:", error);
        setError("Failed to load doctor details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Text style={globalStyles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!doctor) {
    return <Text style={styles.error}>Doctor not found</Text>;
  }

  // Booking appointment
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
          booked_doctor_id: id,
        }),
      });
      if (response.status === 201) {
        alert(
          `Success! Booked appointment with Dr. ${doctor.first_name}. Check your email for details.`
        );
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={globalStyles.title}>
          Book Appointment with this Doctor
        </Text>
        <View style={styles.doctorItem}>
          <Image source={`${url}/${doctor.avatar}`} style={styles.avatar} />
          <View style={styles.details}>
            <Text style={styles.name}>
              Dr. {doctor.first_name} {doctor.last_name}
            </Text>
            <Text style={styles.specialty}>{doctor.doctor.specialty}</Text>
          </View>
        </View>

        {/* Appointment form */}
        <View style={styles.formContainer}>
          {/* Calender */}
          <Text style={[styles.label, { marginBottom: 5 }]}>Select Date:</Text>
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
      </View>
    </ScrollView>
  );
};

export default SingleDoctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    margin: 14,
    marginBottom: 100,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  doctorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: "800",
  },
  specialty: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 10,
  },

  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
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
    color: "#0c0c0c",
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
    borderColor: "#0c0c0c",
    borderWidth: 1,
  },

  picker: {
    color: "#0c0c0c",
    fontSize: 13,
  }, // Calendar
});
