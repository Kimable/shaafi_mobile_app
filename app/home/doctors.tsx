import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import globalStyles from "../../constants/GlobalStyles";
import { Image } from "expo-image";
import { url } from "../../util/url";
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
      <Image source={`${url}/${item.user.avatar}`} style={styles.avatar} />
      <View style={styles.details}>
        <Text style={styles.name}>
          Dr. {item.user.first_name} {item.user.last_name}
        </Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Link href={`/home/singleDoctor/${item.user.id}`} asChild>
          <TouchableOpacity
            onPress={() => handleBookAppointment(item.user.id)}
            style={styles.bookButton}
          >
            <Text
              style={
                (globalStyles.buttonText,
                { fontSize: 10, color: "white", fontWeight: "bold" })
              }
            >
              Book Appointment
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={globalStyles.title}>Our Expert Doctors</Text>
      {doctors.length === 0 ? (
        <View style={globalStyles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.user.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Doctors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginBottom: 46,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  doctorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 4,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 5,
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
  bookButton: {
    marginTop: 10,
    padding: 7,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignItems: "center",
  },
});
