import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Text, View } from "../../components/Themed";
import { Link } from "expo-router";
import auth from "../auth";
import { Image } from "expo-image";
import Colors from "../../constants/Colors";
import { url } from "../url";

interface ApiData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export default function PatientDashboard() {
  const [data, setData] = useState<ApiData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await auth("profile");
      setData(data.user);
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View>
        <View style={styles.header}></View>
        <Image style={styles.avatar} source={`${url}/storage${data?.avatar}`} />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>Hi {data?.first_name}</Text>
            <Text style={styles.info}>How are you feeling today?</Text>
            <Link href="/(forms)/bookAppointment" asChild>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.btnText}>Book an Appointment</Text>
              </TouchableOpacity>
            </Link>
            {/* <TouchableOpacity style={styles.buttonContainer}>
              <Text style={styles.btnText}>Talk To a Doctor</Text>
            </TouchableOpacity> */}
            <Link href="/appointments" asChild>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.btnText}>Past Appointments</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/doctors" asChild>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.btnText}>Doctors</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(payments)" asChild>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.btnText}>Make Payments</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.btnText}>Profile</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.secondary,
    height: 100,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 30,
  },
  name: {
    fontSize: 30,
    color: Colors.secondary,
    fontWeight: "600",
  },
  body: {
    marginTop: 50,
    backgroundColor: "#fafafa",
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
});
