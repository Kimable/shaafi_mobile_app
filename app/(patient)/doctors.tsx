import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import globalStyles from "../../constants/GlobalStyles";
import { Image } from "expo-image";

import { url } from "../url";
import axios from "axios";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

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

  const handleBookAppointment = (doctorId: any) => {
    console.log(doctorId);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.doctorItem}>
      <Image
        source={`${url}/storage${item.user.avatar}`}
        style={styles.avatar}
      />
      <View style={styles.details}>
        <Text style={styles.name}>
          Dr. {item.user.first_name} {item.user.last_name}
        </Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Link href="/(forms)/bookAppointment" asChild>
          <TouchableOpacity
            onPress={() => handleBookAppointment(item.user.id)}
            style={styles.bookButton}
          >
            <Text style={globalStyles.buttonText}>Book Appointment</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <View>
      <Text style={globalStyles.title}>Our Expert Doctors</Text>
      {doctors.length === 0 ? (
        <Text style={globalStyles.loading}>Loading...</Text>
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.user.id.toString()}
        />
      )}
    </View>
  );
};

export default Doctors;

const styles = StyleSheet.create({
  doctorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 2,
    marginHorizontal: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 16,
    color: "#666",
  },
  bookButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignItems: "center",
  },
});
