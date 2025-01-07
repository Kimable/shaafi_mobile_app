import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { View } from "../../components/Themed";
import { Link, Redirect, router } from "expo-router";
import auth from "../../util/auth";
import { Image } from "expo-image";
import Colors from "../../constants/Colors";
import { url } from "../../util/url";
import { Avatar, Button, IconButton, Menu, Text } from "react-native-paper";
import globalStyles from "../../constants/GlobalStyles";

import DashboardCard from "../../components/DashboardCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ApiData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

const getTimeOfDay = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Afternoon";
  } else {
    return "Evening";
  }
};

export default function PatientDashboard() {
  const timeOfDay = getTimeOfDay();
  const [data, setData] = useState<ApiData | null>(null);

  useEffect(() => {
    const isLoggedIn = async () => {};
    isLoggedIn();

    async function fetchData() {
      let tkn = await AsyncStorage.getItem("token");
      if (tkn === "" || tkn === null) {
        return router.replace("/");
      } else {
        const data = await auth("profile");
        setData(data.user);
        console.log(data);
      }
    }
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.subtitle}>Good {timeOfDay},</Text>

          <Text variant="titleLarge" style={styles.name}>
            {data?.first_name} {data?.last_name}
          </Text>

          <Text variant="bodyMedium">How are you feeling today?</Text>

          <DashboardCard
            title="My Profile"
            avatarIcon="account"
            link="/profile"
          />

          <DashboardCard
            title="Manage Family Members"
            avatarIcon="account-group"
            link="/ComingSoon"
          />

          <DashboardCard
            title="Book Appointment"
            avatarIcon="calendar-plus"
            link="/(forms)/bookAppointment"
          />

          <DashboardCard
            title="Orders"
            avatarIcon="cart"
            link="/appointments"
          />

          <DashboardCard
            title="Delivery Address"
            avatarIcon="map-marker"
            link="/ComingSoon"
          />

          <DashboardCard
            title="How App Works"
            avatarIcon="alphabetical"
            link="/ComingSoon"
          />

          <DashboardCard
            title="Share Feedback"
            avatarIcon="message-reply"
            link="/ComingSoon"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    color: Colors.secondary,
    fontWeight: "800",
    marginBottom: 13,
  },
  body: {
    height: "100%",
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  info: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    color: "#fff",
    width: 300,
    borderRadius: 40,
    backgroundColor: Colors.primary,
  },
  btnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  subtitle: {
    color: Colors.primary,
    fontWeight: "700",
  },
});
