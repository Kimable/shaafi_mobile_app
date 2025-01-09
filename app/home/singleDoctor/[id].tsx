// Add a single doctor screen
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import globalStyles from "../../../constants/GlobalStyles";
import { Image } from "expo-image";
import { url } from "../../../util/url";
import axios from "axios";
import Colors from "../../../constants/Colors";
import { Link, useLocalSearchParams } from "expo-router";

// You might want to define an interface for the doctor type
interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  doctor: {
    specialty: string;
  };
}

// Accept doctorId as a prop
const SingleDoctor = () => {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <Text style={globalStyles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!doctor) {
    return <Text style={styles.error}>Doctor not found</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.doctorItem}>
        <Image source={`${url}/${doctor.avatar}`} style={styles.avatar} />
        <View style={styles.details}>
          <Text style={styles.name}>
            Dr. {doctor.first_name} {doctor.last_name}
          </Text>
          <Text style={styles.specialty}>{doctor.doctor.specialty}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SingleDoctor;

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
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
