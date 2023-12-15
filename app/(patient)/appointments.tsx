import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import globalStyles from "../../constants/GlobalStyles";
import auth from "../auth";
import Colors from "../../constants/Colors";
import { Link } from "expo-router";

const AppointmentList = () => {
  const [data, setData]: any = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await auth("appointments");
      if (data.status === 404) {
        setData(data);
      } else {
        setData(data.appointments);
      }

      console.log(data);
    }
    fetchData();
  }, []);

  const getStatusStyles = (status: any) => {
    switch (status) {
      case "waiting":
        return { backgroundColor: "orange" };
      case "completed":
        return { backgroundColor: "green" };
      case "in_progress":
        return { backgroundColor: "blue" };
      default:
        return { backgroundColor: "gray" };
    }
  };

  const handleRefresh = async () => {
    setData([]);
    const data = await auth("appointments");
    if (data.status === 404) {
      setData(data);
    } else {
      setData(data.appointments);
    }
  };

  const handleBookAppointment = () => {
    console.log("book");
  };

  const renderAppointmentItem = ({ item }: any) => {
    const statusStyles = getStatusStyles(item.appointment.status);

    return (
      <View style={styles.appointmentItem}>
        <View style={[styles.statusButton, statusStyles]}>
          <Text style={styles.statusButtonText}>{item.appointment.status}</Text>
        </View>
        <Text style={styles.appointmentDate}>
          Medical Issue:{" "}
          <Text style={globalStyles.boldText}>
            {item.appointment.medical_issue}
          </Text>
        </Text>
        <Text style={styles.appointmentDate}>
          Date:{" "}
          <Text style={globalStyles.boldText}>{item.appointment.date}</Text>
        </Text>
        <Text style={styles.appointmentTime}>
          Time:{" "}
          <Text style={globalStyles.boldText}>{item.appointment.time}</Text>
        </Text>
        <Text style={styles.appointmentDoctor}>
          Doctor:{" "}
          <Text style={globalStyles.boldText}>
            Dr. {item.doctor.first_name} {item.doctor.last_name}
          </Text>
        </Text>

        <Text style={styles.appointmentDoctor}>
          Specialty:{" "}
          <Text style={globalStyles.boldText}>
            {item.doctor.doctor.specialty}
          </Text>
        </Text>
      </View>
    );
  };

  return (
    <>
      <Text style={globalStyles.title}>Your Appointments</Text>
      {data.length === 0 ? (
        <Text style={globalStyles.loading}>Loading....</Text>
      ) : data.status === 404 ? (
        <>
          <Text style={styles.error}>{data.errorMsg}</Text>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Link href="/(forms)/bookAppointment" asChild>
                <TouchableOpacity style={globalStyles.button}>
                  <Text style={globalStyles.buttonText}>Book Appointment</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => handleRefresh()}
              >
                <Text style={globalStyles.buttonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.appointment.id.toString()}
            renderItem={renderAppointmentItem}
          />
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Link href="/(forms)/bookAppointment" asChild>
                <TouchableOpacity style={globalStyles.button}>
                  <Text style={globalStyles.buttonText}>Book Appointment</Text>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={() => handleRefresh()}
              >
                <Text style={globalStyles.buttonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  appointmentItem: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fafaff",
    marginHorizontal: 12,
  },
  statusButton: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  statusButtonText: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
  },
  appointmentDate: {
    fontSize: 16,
  },
  appointmentTime: {
    fontSize: 14,
  },
  appointmentDoctor: {
    fontSize: 14,
  },

  error: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.secondary,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 13,
  },
});

export default AppointmentList;
