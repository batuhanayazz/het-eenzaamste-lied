import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";

const SongItem = ({ item }) => {
  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
    >
      <Image
        style={{ width: 50, height: 50, marginRight: 10 }}
        source={{ uri: item.track?.album?.images[0].url }}
      />
      <View>
        <Text
          numberOfLines={1}
          style={{ fontWeight: "bold", fontSize: 14, color: "white" }}
        >
          {item?.track?.name}
        </Text>
        <Text style={{ marginTop: 4, color: "#989898" }}>
          {item?.track?.artists[0].name}
        </Text>
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
