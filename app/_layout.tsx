import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import Colors from "../constants/Colors";
import {
  ThemeProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const theme = {
  ...DefaultTheme,

  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: "#ec1c24",
    secondary: "#2E3191",
    tertiary: "#00a551",
  },
};
function RootLayoutNav() {
  return (
    <ThemeProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Welcome",
            headerStyle: { backgroundColor: Colors.secondary },
            headerTintColor: Colors.white,
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="ComingSoon"
          options={{
            title: "Coming Soon",
            headerStyle: { backgroundColor: Colors.secondary },
            headerTintColor: Colors.white,
            headerShown: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
