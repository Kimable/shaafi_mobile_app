import { View, Text } from "react-native";
import React from "react";
import globalStyles from "../../constants/GlobalStyles";

const health_records = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>My Health Records</Text>
      <Text>You have no health records yet.</Text>
      <Text>When your doctor adds a record you will see it here</Text>
    </View>
  );
};

export default health_records;
