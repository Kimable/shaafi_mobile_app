import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./url";

const auth = async (path: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token !== null) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Authorization", `Bearer ${token}`);

      const dbRequest = await fetch(`${url}/api/${path}`, {
        headers,
      });
      const data = await dbRequest.json();
      if (data.message === "Invalid token") {
        await AsyncStorage.setItem("token", "");
        return null;
      } else {
        return data;
      }
    } else {
      await AsyncStorage.setItem("token", "");
      return null;
    }
  } catch (error: any) {
    await AsyncStorage.setItem("token", "");
    return null;
  }
};

export default auth;
