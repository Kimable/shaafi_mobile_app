import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native";

const HowAppWorksScreen = () => {
  const features = [
    {
      title: "Book Appointments",
      description:
        "Schedule in-person consultations with our qualified doctors. Choose your preferred doctor, date, and time slot. Get instant confirmation.",
      steps: [
        "Browse through our list of specialists",
        "Select your preferred date and available time slot",
        "Fill in your medical concern briefly",
        "Confirm your booking with one tap",
        "Receive booking confirmation via email",
      ],
    },
    {
      title: "Video Consultations",
      description:
        "Connect with doctors from the comfort of your home through secure video calls.",
      steps: [
        "Choose 'Video Consultation' option",
        "Select specialist, date, time",
        "Receive booking confirmation via email",
        "Make payments online",
        "Receive video call link before appointment",
        "Join the call at scheduled time",
      ],
    },
    {
      title: "Emergency Services",
      description:
        "Quick access to emergency services with real-time ambulance tracking.",
      steps: [
        "Tap the emergency button on home screen",
        "Tap our emergency number and call directly",
        "Or tap the maps icon to find nearest hospital",
      ],
    },
    {
      title: "Profile Management",
      description:
        "Keep your medical history and personal information up to date.",
      steps: [
        "Update personal information",
        "Upload medical records",
        "View appointment history",
        "Access medical reports",
      ],
    },
  ];

  const FeatureCard = ({ feature }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{feature.title}</Text>
      <Text style={styles.cardDescription}>{feature.description}</Text>
      <Text style={styles.stepsTitle}>How to use:</Text>
      {feature.steps.map((step: any, index: any) => (
        <View key={index} style={styles.stepContainer}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How Shaafi Hospital App Works</Text>
        <Text style={styles.subtitle}>
          Your healthcare companion for easy appointment booking, video
          consultations, and emergency services
        </Text>
      </View>

      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Need help? Contact our 24/7 support at support@shaafihospital.so
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    lineHeight: 24,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 10,
  },
  stepNumber: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
    fontWeight: "500",
  },
  stepText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default HowAppWorksScreen;
