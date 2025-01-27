import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "react-native";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../../util/url";

const ShareFeedbackScreen = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [department, setDepartment] = useState("");

  const feedbackTypes = [
    "General Experience",
    "Doctor Consultation",
    "Video Consultation",
    "Appointment Booking",
    "App Usage",
    "Emergency Services",
  ];

  const departments = [
    "General Medicine",
    "Pediatrics",
    "Cardiology",
    "Orthopedics",
    "Emergency",
    "Gynecology",
    "Dermatology",
    "Ophthalmology",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!feedbackType || !rating || !comment) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    console.log(feedbackType, rating, comment, department);
    // Here you would typically send the feedback to your backend
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);
      const sendFeedback = await fetch(`${url}/api/add-feedback`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: feedbackType,
          rating,
          department,
          comment,
        }),
      });

      console.log(sendFeedback.status);
      if (sendFeedback.status !== 201) {
        Alert.alert(
          "Error",
          "Failed to submit feedback. Please try again later."
        );
        return;
      }

      const response = await sendFeedback.json();

      Alert.alert("Thank You!", response.message, [
        { text: "OK", onPress: () => resetForm() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", `Failed to submit feedback: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFeedbackType("");
    setRating(0);
    setComment("");
    setDepartment("");
  };

  const RatingStars = () => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
          style={styles.starButton}
        >
          <Text
            style={[
              styles.star,
              { color: star <= rating ? "#FFD700" : "#D3D3D3" },
            ]}
          >
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Share Your Feedback</Text>
          <Text style={styles.subtitle}>
            Help us improve our services by sharing your experience
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Type of Feedback*</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typesContainer}
          >
            {feedbackTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  feedbackType === type && styles.selectedType,
                ]}
                onPress={() => setFeedbackType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    feedbackType === type && styles.selectedTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Department (Optional)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typesContainer}
          >
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.typeButton,
                  department === dept && styles.selectedType,
                ]}
                onPress={() => setDepartment(dept)}
              >
                <Text
                  style={[
                    styles.typeText,
                    department === dept && styles.selectedTypeText,
                  ]}
                >
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Rate Your Experience*</Text>
          <RatingStars />

          <Text style={styles.label}>Your Feedback*</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Please share your experience, suggestions, or concerns..."
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>

          <Text style={styles.note}>* Required fields</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.tertiary,
  },
  typeText: {
    color: "#666",
    fontSize: 14,
  },
  selectedTypeText: {
    color: "#fff",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    marginBottom: 20,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: Colors.tertiary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ShareFeedbackScreen;
