import { StyleSheet, Text, View } from "react-native";
import React from "react";
import globalStyles from "../constants/GlobalStyles";

const ComingSoon = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Screen under Development </Text>
      <Text>This screen will be available soon</Text>
    </View>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({});
