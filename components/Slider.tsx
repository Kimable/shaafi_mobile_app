import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import data from "../util/sliderData";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Slider = () => {
  const width = Dimensions.get("window").width;
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        autoPlayInterval={3000}
        data={[...data, ...data]}
        scrollAnimationDuration={1500}
        renderItem={({ item, index, animationValue }) => (
          <View style={{ justifyContent: "center", borderRadius: 10 }}>
            <Image
              style={{ borderRadius: 10, width: "100%", height: "100%" }}
              source={item.img}
              placeholder={blurhash}
              transition={1000}
              contentFit="none"
            />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
});
