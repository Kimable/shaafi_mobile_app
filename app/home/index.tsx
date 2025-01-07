import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Searchbar,
  Text,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import auth from "../../util/auth";
import globalStyles from "../../constants/GlobalStyles";
import Colors from "../../constants/Colors";
import { Link, Redirect, router, useRouter } from "expo-router";
import Slider from "../../components/Slider";
import BottomBar from "../../components/BottomBar";
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

const index = () => {
  const timeOfDay = getTimeOfDay();
  const [data, setData] = useState<ApiData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      let tkn = await AsyncStorage.getItem("token");
      if (tkn === "" || tkn === null) {
        return router.replace("/");
      } else {
        const data = await auth("profile");
        setData(data.user);
      }
    }
    fetchData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.bodyContent}>
          <Text style={styles.subtitle}>Good {timeOfDay},</Text>

          <Text variant="titleLarge" style={styles.name}>
            {data?.first_name} {data?.last_name}
          </Text>
          <Text variant="bodyMedium">How are you feeling today?</Text>

          <View style={[globalStyles.card, { marginTop: 20 }]}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "700" }}>
                Book An Online Appointment
              </Text>
              <Avatar.Icon
                icon="calendar"
                size={30}
                style={{ backgroundColor: Colors.primary, marginBottom: 6 }}
              />
            </View>
            <Link href="/(forms)/bookAppointment" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Book Appointment</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.cardContainer}>
            <View style={[globalStyles.card, styles.card]}>
              <Link href="/home/doctors">
                <Avatar.Icon
                  icon="doctor"
                  size={40}
                  style={{ backgroundColor: Colors.tertiary, marginBottom: 6 }}
                />
              </Link>
              <Link href="/home/doctors">
                <Text style={[styles.subtitle, { color: Colors.tertiary }]}>
                  Find A Doctor
                </Text>
              </Link>
            </View>
            <View style={[globalStyles.card, styles.card]}>
              <Link href="/(forms)/onlineConsultation">
                <Avatar.Icon
                  icon="video"
                  size={40}
                  style={{ backgroundColor: Colors.tertiary, marginBottom: 6 }}
                />
              </Link>
              <Text style={[styles.subtitle, { color: Colors.tertiary }]}>
                Video Consult
              </Text>
            </View>

            <View style={[globalStyles.card, styles.card]}>
              <Link href="/(patient)/emergency">
                <Avatar.Icon
                  icon="hospital"
                  size={40}
                  style={{ backgroundColor: Colors.primary, marginBottom: 6 }}
                />
              </Link>
              <Text style={[styles.subtitle, { color: Colors.tertiary }]}>
                Emergency
              </Text>
            </View>
            <View style={[globalStyles.card, styles.card]}>
              <Link href="/(patient)/dashboard">
                <Avatar.Icon
                  icon="home"
                  size={40}
                  style={{ backgroundColor: Colors.tertiary, marginBottom: 6 }}
                />
              </Link>
              <Text style={[styles.subtitle, { color: Colors.tertiary }]}>
                Dashboard
              </Text>
            </View>
          </View>

          <View style={{ margin: 10 }}>
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                fontSize: 20,
                fontWeight: "700",
                color: Colors.secondary,
              }}
            >
              Home Healthcare Services
            </Text>
            <Slider />
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default index;

const styles = StyleSheet.create({
  bodyContent: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 3,
  },

  button: {
    backgroundColor: Colors.tertiary,
    padding: 15,
    marginTop: 15,
    borderRadius: 5,
    width: "100%",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  cardContainer: {
    marginHorizontal: 5,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  card: {
    width: "45%",
    marginHorizontal: 4,
    marginTop: 4,
    alignItems: "center",
  },
  subtitle: {
    color: Colors.primary,
    fontWeight: "700",
  },
  name: {
    color: Colors.secondary,
    fontWeight: "800",
    marginBottom: 13,
  },
});
