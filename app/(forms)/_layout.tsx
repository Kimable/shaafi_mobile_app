import { Stack } from "expo-router";
import Colors from "../../constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "../i18n";

export default function authLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.tertiary },
          headerTintColor: Colors.white,
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: i18n.t("Login"),
          }}
        />

        <Stack.Screen
          name="bookAppointment"
          options={{
            title: i18n.t("Book Appointment"),
          }}
        />

        <Stack.Screen
          name="updateProfile"
          options={{
            title: i18n.t("Update Profile"),
          }}
        />

        <Stack.Screen
          name="onlineConsultation"
          options={{
            title: i18n.t("Online Consultation"),
          }}
        />
        <Stack.Screen
          name="registration"
          options={{ title: i18n.t("Registration") }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
