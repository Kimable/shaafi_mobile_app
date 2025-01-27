import { StyleSheet } from "react-native";
import Colors from "./Colors";

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  form: {
    width: 300,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "grey",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 10,
  },
  secondaryButton: {
    backgroundColor: Colors.tertiary,
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
  },

  text: {
    color: Colors.black,
    marginTop: 12,
    fontSize: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 17,
    textAlign: "center",
    marginVertical: 10,
    color: Colors.secondary,
    textTransform: "uppercase",
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "96%",
    marginVertical: 5,
  },
  loading: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "800",
    color: Colors.primary,
  },

  boldText: {
    fontWeight: "800",
  },
});

export default globalStyles;
