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
import { EvilIcons } from "@expo/vector-icons";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const onlineConsultation = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [medicalIssue, setMedicalIssue] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!date || !time || !medicalIssue) {
      alert("Please fill all fields.");
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
        }),
      });
      if (response.status === 201) {
        alert(
          "Congrats! You've successfully booked an video consultation. Check your email for details."
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
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: Colors.tertiary,
          paddingHorizontal: 15,
          paddingVertical: 30,
          borderRadius: 10,
        }}
      >
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
          Book A Video Consultation
        </Text>
        {/* Calender */}
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
    marginVertical: 12,
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
