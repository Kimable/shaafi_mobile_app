// Add a single doctor screen
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
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
import { useLocalSearchParams } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import i18n from "../../i18n";

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
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!doctor) {
    return <Text style={styles.error}>Doctor not found</Text>;
  }

  // Booking appointment
  const handleAppointmentSubmit = async () => {
    if (!date) {
      Alert.alert("Empty Date", "Please select a date");
      return;
    }
    if (!time) {
      Alert.alert("Empty time", "Please select a time");
      return;
    }

    if (!medicalConcern) {
      Alert.alert("Empty Medical Concern", "Please write a Medical Concern");
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
          {i18n.t("Book Appointment With This Doctor")}
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
          <Text style={[styles.label, { marginBottom: 5 }]}>
            {i18n.t("Select Date")}:
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
              todayBackgroundColor="#000"
              todayTextStyle={{ color: "#fff" }}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t("Time")}</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM AM/PM"
              value={time}
              onChangeText={setTime}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t("Gender")}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={gender}
                onValueChange={setGender}
              >
                <Picker.Item label={i18n.t("Select Gender")} value="" />
                <Picker.Item label={i18n.t("Male")} value="Male" />
                <Picker.Item label={i18n.t("Female")} value="Female" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t("Medical Concern")}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t("Brief medical concern")}
              value={medicalConcern}
              onChangeText={setMedicalConcern}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t("Description")}</Text>
            <TextInput
              style={[styles.input, styles.description]}
              multiline
              numberOfLines={4}
              placeholder={i18n.t(
                "Provide more details about your medical concern"
              )}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAppointmentSubmit}
          >
            <Text style={styles.submitButtonText}>
              {i18n.t("Submit Appointment")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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

  datePicker: {
    marginTop: 5,
  },

  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.tertiary,
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

export default SingleDoctor;
