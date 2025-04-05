import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Fontisto } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import { Avatar } from "react-native-paper";
import i18n from "../i18n";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof EvilIcons>["name"];
  color: string;
}) {
  return <EvilIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  //const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.tertiary },
        headerTintColor: Colors.white,
        tabBarActiveTintColor: Colors.primary,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: i18n.t("Dashboard"),
          tabBarIcon: ({ color }) => <TabBarIcon name="chart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: i18n.t("Appointments"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="emergency"
        options={{
          title: i18n.t("Emergency"),
          tabBarIcon: ({ color }) => (
            <Avatar.Icon
              icon="ambulance"
              size={40}
              color="#fff"
              style={{ backgroundColor: Colors.primary }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="health_records"
        options={{
          title: i18n.t("Health Records"),
          tabBarIcon: ({ color }) => (
            <Avatar.Icon
              icon="file-multiple"
              size={30}
              style={{ backgroundColor: "#fff" }}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: i18n.t("Profile"),
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
