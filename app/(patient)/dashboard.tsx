import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import auth from "../../util/auth";
import Colors from "../../constants/Colors";
import DashboardCard from "../../components/DashboardCard";
import i18n from "../i18n";

interface ApiData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

const getTimeOfDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) return "Morning";
  if (currentHour >= 12 && currentHour < 18) return "Afternoon";
  return "Evening";
};

export default function PatientDashboard() {
  const { width } = useWindowDimensions();
  const timeOfDay = getTimeOfDay();
  const [data, setData] = useState<ApiData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return router.dismissTo("/");
      }
      try {
        const response = await auth("profile");
        setData(response.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.subtitle}>{i18n.t(`Good ${timeOfDay}`)},</Text>

      <Text variant="titleLarge" style={styles.name}>
        {data?.first_name} {data?.last_name}
      </Text>

      <Text variant="bodyMedium" style={styles.greetingText}>
        {i18n.t("feeling")}
      </Text>

      <View
        style={[
          styles.cardsContainer,
          { flexDirection: width > 768 ? "row" : "column" },
        ]}
      >
        <DashboardCard
          title={i18n.t("Find A Doctor")}
          avatarIcon="doctor"
          link="/home/doctors"
        />
        <DashboardCard
          title={i18n.t("Profile")}
          avatarIcon="account"
          link="/profile"
        />
        <DashboardCard
          title={i18n.t("Book Appointment")}
          avatarIcon="calendar-plus"
          link="/(forms)/bookAppointment"
        />
        <DashboardCard
          title={i18n.t("Your Appointments")}
          avatarIcon="calendar"
          link="/appointments"
        />
        <DashboardCard
          title={i18n.t("How App Works")}
          avatarIcon="alphabetical"
          link="/home/howAppWorks"
        />
        <DashboardCard
          title={i18n.t("Share Feedback")}
          avatarIcon="message-reply"
          link="/home/ShareFeedback"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  name: {
    color: Colors.secondary,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 20,
  },
  greetingText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  cardsContainer: {
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    marginTop: 20,
  },
});
