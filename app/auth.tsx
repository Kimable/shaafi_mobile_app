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
      return data;
    } else {
      return "You must be logged in";
    }
  } catch (error: any) {
    return error.message;
  }
};

export default auth;
