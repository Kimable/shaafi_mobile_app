import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Link } from "expo-router";
import Colors from "../../constants/Colors";
import auth from "../../util/auth";
import i18n from "../i18n";

interface Doctor {
  first_name: string;
  doctor: {
    specialty: string;
  };
}

interface Appointment {
  id: number;
  status: "waiting" | "completed" | "in_progress";
  medical_issue: string;
  date: string;
  time: string;
}

interface AppointmentData {
  appointment: Appointment;
  doctor: Doctor | null;
}

interface StatusBadgeProps {
  status: Appointment["status"];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: Appointment["status"]) => {
    const configs = {
      waiting: {
        color: "#FFB020",
        backgroundColor: "rgba(255, 176, 32, 0.12)",
        label: "Waiting",
      },
      completed: {
        color: "#14B8A6",
        backgroundColor: "rgba(20, 184, 166, 0.12)",
        label: "Completed",
      },
      in_progress: {
        color: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.12)",
        label: "In Progress",
      },
    };
    return configs[status];
  };

  const config = getStatusConfig(status);

  return (
    <View
      style={[styles.statusBadge, { backgroundColor: config.backgroundColor }]}
    >
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const AppointmentCard: React.FC<{ item: AppointmentData }> = ({ item }) => (
  <View style={styles.appointmentCard}>
    <StatusBadge status={item.appointment.status} />

    <View style={styles.appointmentInfo}>
      <Text style={styles.medicalIssue}>{item.appointment.medical_issue}</Text>

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{i18n.t("Date")}</Text>
          <Text style={styles.detailValue}>{item.appointment.date}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>{i18n.t("Time")}</Text>
          <Text style={styles.detailValue}>{item.appointment.time}</Text>
        </View>
      </View>

      <View style={styles.doctorInfo}>
        <Text style={styles.detailLabel}>{i18n.t("Doctor")}</Text>
        <Text style={styles.detailValue}>
          {item.doctor ? `Dr. ${item.doctor.first_name}` : "Unspecified"}
        </Text>

        <Text style={styles.detailLabel}>{i18n.t("Specialty")}</Text>
        <Text style={styles.detailValue}>
          {item.doctor
            ? i18n.t(`${item.doctor.doctor.specialty}`)
            : i18n.t("Not Applicable")}
        </Text>
      </View>
    </View>
  </View>
);

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await auth("appointments");
      if (response.status === 404) {
        setError(response.errorMsg);
        setAppointments([]);
      } else {
        setAppointments(response.appointments);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments().finally(() => setRefreshing(false));
  }, []);

  const ActionButtons = () => (
    <View style={styles.actionButtons}>
      <Link href="/(forms)/bookAppointment" asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>{i18n.t("Book Appointment")}</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={styles.secondaryButton} onPress={onRefresh}>
        <Text style={styles.secondaryButtonText}>{i18n.t("Refresh")}</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("Your Appointments")}</Text>

      {error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <ActionButtons />
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.appointment.id.toString()}
          renderItem={({ item }) => <AppointmentCard item={item} />}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={ActionButtons}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {i18n.t("No appointments found")}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
    padding: 20,
    paddingBottom: 10,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  appointmentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  appointmentInfo: {
    gap: 12,
  },
  medicalIssue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.secondary,
    fontWeight: "500",
  },
  doctorInfo: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});

export default AppointmentList;
