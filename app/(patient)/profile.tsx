import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import auth from "../../util/auth";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { url } from "../../util/url";
import Colors from "../../constants/Colors";
import globalStyles from "../../constants/GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Redirect, router, useRouter } from "expo-router";

interface ApiData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export default function PatientProfile() {
  const [data, setData] = useState<ApiData | null>(null);
  const redirect = useRouter();

  useEffect(() => {
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

  const handleLogout = () => {
    AsyncStorage.setItem("token", "");
    return redirect.replace("/");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {data === null ? (
          <Text style={globalStyles.loading}>Loading...</Text>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Your Profile</Text>
              <Image
                style={styles.avatar}
                source={`${url}/storage${data?.avatar}`}
              />
            </View>
            <Text style={styles.subtitle}>Personal information</Text>

            <View style={globalStyles.card}>
              <Text style={styles.text}>
                Name:{" "}
                <Text style={styles.innerText}>
                  {data?.first_name} {data?.last_name}
                </Text>
              </Text>
            </View>

            <View style={globalStyles.card}>
              <Text style={styles.text}>
                Email: <Text style={styles.innerText}>{data?.email}</Text>
              </Text>
            </View>

            <View style={globalStyles.card}>
              <Text style={styles.text}>
                Phone: <Text style={styles.innerText}>{data?.phone}</Text>
              </Text>
            </View>
            <Link replace href="/(forms)/updateProfile" asChild>
              <TouchableOpacity style={styles.buttonContainer}>
                <Text style={styles.btnText}>Update Profile</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: Colors.secondary,
    width: "100%",
    paddingVertical: 20,
  },
  title: {
    fontSize: 25,
    marginTop: 10,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    marginBottom: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
  innerText: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 13,
    textTransform: "uppercase",
    textAlign: "left",
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
  logoutText: {
    color: "gray",
    textAlign: "left",
    marginTop: 25,
  },
});
