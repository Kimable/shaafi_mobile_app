import { Stack } from "expo-router";
import Colors from "../../constants/Colors";

export default function paymentsLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Make Payments",
        }}
      />
    </Stack>
  );
}
