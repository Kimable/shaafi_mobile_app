import React, { useState } from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Colors from "../constants/Colors";
import i18n from "../app/i18n";

interface FileDownloadLinkProps {
  url: string;
  filename: string;
}

const FileDownloadLink = ({ url, filename }: FileDownloadLinkProps) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async () => {
    try {
      setDownloading(true);
      setError(null);

      // Create a local file path in app's cache directory
      const localUri = `${FileSystem.cacheDirectory}${filename}`;

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(url, localUri);

      if (downloadResult.status !== 200) {
        throw new Error("Failed to download file");
      }

      // Check if sharing is available on the device
      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (isSharingAvailable) {
        // Open the share dialog
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        throw new Error("Sharing is not available on this device");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={downloadFile} disabled={downloading}>
        {downloading ? (
          <ActivityIndicator color={Colors.tertiary} />
        ) : (
          <Text style={{ color: Colors.primary, fontWeight: 700 }}>
            {i18n.t("Download")}
          </Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text style={{ color: "red", marginTop: 10 }}>Error: {error}</Text>
      )}
    </View>
  );
};

export default FileDownloadLink;
