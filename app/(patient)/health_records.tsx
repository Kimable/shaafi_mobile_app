import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import Colors from "../../constants/Colors";
import { url } from "../../util/url";
import auth from "../../util/auth";
import { Feather, Ionicons } from "@expo/vector-icons";
import FileDownloadLink from "../../components/FileDownloadLink";
import i18n from "../i18n";

interface HealthRecord {
  id: string;
  type: "lab_result" | "prescription" | "vaccination" | "medical_report";
  title: string;
  date: string;
  doctor_name: string;
  description: string;
  fileUrl?: string;
}

interface CategoryProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  onPress: () => void;
  isActive: boolean;
}

const CategoryButton: React.FC<CategoryProps> = ({
  icon,
  title,
  count,
  onPress,
  isActive,
}) => (
  <TouchableOpacity
    style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
    onPress={onPress}
  >
    <View style={styles.categoryIcon}>{icon}</View>
    <Text
      style={[styles.categoryTitle, isActive && styles.categoryTitleActive]}
    >
      {title}
    </Text>
    <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
      <Text style={[styles.countText, isActive && styles.countTextActive]}>
        {count}
      </Text>
    </View>
  </TouchableOpacity>
);

const RecordCard: React.FC<{
  record: HealthRecord;
  onPress: (record: HealthRecord) => void;
}> = ({ record, onPress }) => (
  <TouchableOpacity style={styles.recordCard} onPress={() => onPress(record)}>
    <View style={styles.recordHeader}>
      <View style={styles.recordType}>
        <Feather name="file-text" size={20} color={Colors.primary} />
        <Text style={styles.recordTypeText}>
          {record.type.replace("_", " ")}
        </Text>
      </View>
      <Text style={styles.recordDate}>{record.date}</Text>
    </View>

    <Text style={styles.recordTitle}>{record.title}</Text>
    <Text style={styles.recordDoctor}>Dr. {record.doctor_name}</Text>
    <Text style={styles.recordDescription} numberOfLines={2}>
      {record.description}
    </Text>

    <TouchableOpacity style={styles.downloadButton}>
      <Feather name="download" size={20} color={Colors.primary} />
      <FileDownloadLink
        url={`${url}/health-record/${record.id}`}
        filename={`${record.title}.pdf`}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

const HealthRecordsScreen: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = async () => {
    try {
      const data = await auth(`health-records`);
      console.log(data.records);

      // Ensure records is set to an empty array if undefined
      setRecords(data?.records || []);
    } catch (error: any) {
      Alert.alert("Error", "Failed to fetch health records: " + error?.message);
      setRecords([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRecords().finally(() => setRefreshing(false));
  }, []);

  const handleRecordPress = (record: HealthRecord) => {
    // Handle record selection
    Alert.alert(record.title, record.description);
  };

  const filteredRecords = records
    ? records.filter(
        (record) =>
          selectedCategory === "all" || record.type === selectedCategory
      )
    : [];

  const categories = [
    {
      id: "all",
      icon: <Feather name="activity" size={24} color={Colors.primary} />,
      title: i18n.t("All Records"),
    },
    {
      id: "lab_result",
      icon: <Ionicons name="flask" size={24} color={Colors.primary} />,
      title: i18n.t("Lab Results"),
    },
    {
      id: "medical_report",
      icon: <Feather name="file-text" size={24} color={Colors.primary} />,
      title: i18n.t("Reports"),
    },
    {
      id: "prescription",
      icon: <Feather name="file-plus" size={24} color={Colors.primary} />,
      title: i18n.t("Prescriptions"),
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return records.length === 0 ? (
    <View
      style={
        (styles.container,
        {
          justifyContent: "center",
          alignItems: "center",
          marginTop: 50,
          paddingHorizontal: 20,
        })
      }
    >
      <Feather name="file" size={40} color="#000" />
      <Text style={styles.emptyText}>
        You have No health records. When your doctor uploads your health
        records, you will be able to see them here.
      </Text>
    </View>
  ) : (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            icon={category.icon}
            title={category.title}
            count={
              records.filter((r) =>
                category.id === "all" ? true : r.type === category.id
              ).length
            }
            onPress={() => setSelectedCategory(category.id)}
            isActive={selectedCategory === category.id}
          />
        ))}
      </ScrollView>

      <ScrollView
        style={styles.recordsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.recordsList}>
          {filteredRecords.length === 0 ? (
            <Text style={styles.emptyText}>{i18n.t("No records found")}</Text>
          ) : (
            filteredRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onPress={handleRecordPress}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* <Link href="/(forms)/addHealthRecord" asChild>
        <TouchableOpacity style={styles.fab}>
          <Plus size={24} color="#fff" />
          <Text style={styles.fabText}>Add Record</Text>
        </TouchableOpacity>
      </Link> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "100%", // Ensure it doesn't exceed screen width
    flexGrow: 0, // Prevent expanding to fill container
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.secondary,
    marginRight: 8,
  },
  categoryTitleActive: {
    color: "#fff",
  },
  countBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.secondary,
  },
  countTextActive: {
    color: "#fff",
  },
  recordsContainer: {
    flex: 1,
  },
  recordsList: {
    padding: 16,
  },
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recordType: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordTypeText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.primary,
    textTransform: "capitalize",
  },
  recordDate: {
    fontSize: 14,
    color: "#666",
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 8,
  },
  recordDoctor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recordDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 12,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f7",
  },
  downloadText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 10,
    right: 24,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 32,
  },
});

export default HealthRecordsScreen;
