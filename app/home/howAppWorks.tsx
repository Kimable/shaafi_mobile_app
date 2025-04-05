import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native";
import i18n from "../i18n";

const HowAppWorksScreen = () => {
  const features = [
    {
      title: i18n.t("Book Appointments"),
      description: i18n.t("scheduleInPerson"),
      steps: [
        i18n.t("Browse through our list of specialists"),
        i18n.t("Select your preferred date and available time slot"),
        i18n.t("Fill in your medical concern briefly"),
        i18n.t("Confirm your booking with one tap"),
        i18n.t("Receive booking confirmation via email"),
      ],
    },
    {
      title: i18n.t("Video Consultations"),
      description: i18n.t("Connect with doctors from the comfort of your home through secure video calls"),
      steps: [
        i18n.t("Choose 'Video Consultation' option"),
        i18n.t("Select specialist, date, time"),
        i18n.t("Receive booking confirmation via email"),
        i18n.t("Make payments online"),
        i18n.t("Receive video call link before appointment"),
        i18n.t("Join the call at scheduled time"),
      ],
    },
    {
      title: i18n.t("Emergency Services"),
      description: i18n.t("Quick access to emergency services with real-time ambulance tracking"),
      steps: [
        i18n.t("Tap the emergency button on home screen"),
        i18n.t("Tap our emergency number and call directly"),
        i18n.t("Or tap the maps icon to find nearest hospital"),
      ],
    },
    {
      title: i18n.t("Profile Management"),
      description: i18n.t("Keep your medical history and personal information up to date"),
      steps: [
        i18n.t("Update personal information"),
        i18n.t("Upload medical records"),
        i18n.t("View appointment history"),
        i18n.t("Access medical reports"),
      ],
    },
  ];

  const FeatureCard = ({ feature }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{feature.title}</Text>
      <Text style={styles.cardDescription}>{feature.description}</Text>
      <Text style={styles.stepsTitle}>{i18n.t("How to use")}:</Text>
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
        <Text style={styles.title}>
          {i18n.t("How Shaafi Hospital App Works")}
        </Text>
        <Text style={styles.subtitle}>
          {i18n.t("Your healthcare companion for easy appointment booking, video consultations, and emergency services")}
        </Text>
      </View>

      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {i18n.t("needHelp")}
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
