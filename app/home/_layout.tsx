import { Link, Stack } from "expo-router";
import Colors from "../../constants/Colors";
import { Pressable } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

export default function HomeLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: Colors.tertiary },
          headerTintColor: Colors.white,
          headerShown: true,
          headerRight: () => (
            <Link href="/(patient)/dashboard" asChild>
              <Pressable>
                {({ pressed }) => (
                  <EvilIcons
                    name="navicon"
                    size={30}
                    color={Colors.white}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="doctors"
        options={{
          title: "Doctors",
          headerStyle: { backgroundColor: Colors.tertiary },
          headerTintColor: Colors.white,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="singleDoctor/[id]"
        options={{
          title: "Doctor",
          headerStyle: { backgroundColor: Colors.tertiary },
          headerTintColor: Colors.white,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="howAppWorks"
        options={{
          title: "How The App Works",
          headerStyle: { backgroundColor: Colors.tertiary },
          headerTintColor: Colors.white,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ShareFeedback"
        options={{
          title: "Share Feedback",
          headerStyle: { backgroundColor: Colors.tertiary },
          headerTintColor: Colors.white,
          headerShown: true,
        }}
      />
    </Stack>
  );
}
