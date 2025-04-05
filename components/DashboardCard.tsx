import React from "react";

import { Avatar, Card, IconButton } from "react-native-paper";
import { Link } from "expo-router";
import Colors from "../constants/Colors";

const DashboardCard = ({ title, avatarIcon, link }: any) => {
  return (
    <Link replace href={link}>
      <Card.Title
        title={title}
        style={{
          backgroundColor: "#fff",
          borderRadius: 5,
          marginTop: 13,
          paddingVertical: 20,
        }}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon={avatarIcon}
            style={{ backgroundColor: Colors.tertiary }}
          />
        )}
        right={(props) => (
          <IconButton
            {...props}
            iconColor={Colors.primary}
            size={30}
            icon="arrow-right-circle"
          />
        )}
      />
    </Link>
  );
};

export default DashboardCard;
