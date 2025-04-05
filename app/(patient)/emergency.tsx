import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import globalStyles from "../../constants/GlobalStyles";
import Colors from "../../constants/Colors";
import { Avatar } from "react-native-paper";
import { Link } from "expo-router";
import i18n from "../i18n";

const emergency = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{i18n.t("Emergency Information")}</Text>

      <TouchableOpacity style={{ marginTop: 12 }}>
        <View style={styles.card}>
          <Avatar.Icon
            icon="ambulance"
            size={27}
            style={{ backgroundColor: Colors.primary }}
          />

          <Text style={styles.emergencyNo}>+252 61 2877778</Text>
        </View>
      </TouchableOpacity>

      <Link
        style={{ marginTop: 12 }}
        href="https://www.google.com/maps/dir//Shaafi+Hospital,+Digfeer+Rd,+Mogadishu,+Somalia/@2.0389872,45.3026766,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3d58420684ef97b1:0x1d8a50121dce357!2m2!1d45.3026766!2d2.0389872?entry=ttu"
      >
        <View style={styles.card}>
          <Avatar.Icon
            icon="map"
            size={27}
            style={{ backgroundColor: Colors.primary }}
          />
          <Text style={styles.emergencyNo}>{i18n.t("Get Directions")}</Text>
        </View>
      </Link>
    </View>
  );
};

export default emergency;

const styles = StyleSheet.create({
  emergencyNo: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    width: 300,
    paddingVertical: 15,
    paddingHorizontal: 35,
    textAlign: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
