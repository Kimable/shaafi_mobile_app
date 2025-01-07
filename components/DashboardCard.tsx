import React from "react";

import { Avatar, Card, IconButton } from "react-native-paper";
import { Link } from "expo-router";
import Colors from "../constants/Colors";

const DashboardCard = ({ title, avatarIcon, link }: any) => {
  return (
    <Card.Title
      title={title}
      style={{ backgroundColor: "#fff", borderRadius: 5, marginTop: 13 }}
      left={(props) => (
        <Avatar.Icon
          {...props}
          icon={avatarIcon}
          style={{ backgroundColor: Colors.secondary }}
        />
      )}
      right={(props) => (
        <Link href={link}>
          <IconButton {...props} icon="arrow-right-circle" />
        </Link>
      )}
    />
  );
};

export default DashboardCard;
