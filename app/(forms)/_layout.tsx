import { Stack } from "expo-router";
import Colors from "../../constants/Colors";

export default function authLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.secondary },
        headerTintColor: Colors.white,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />

      <Stack.Screen
        name="bookAppointment"
        options={{
          title: "Book Appointment",
        }}
      />

      <Stack.Screen
        name="updateProfile"
        options={{
          title: "Update Profile",
        }}
      />

      <Stack.Screen
        name="onlineConsultation"
        options={{
          title: "Online Consultation",
        }}
      />
      <Stack.Screen name="registration" options={{ title: "Registration" }} />
    </Stack>
  );
}
