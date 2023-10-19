import { StyleSheet, Text, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { View } from "react-native";
import { set } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SongItem from "../components/SongItem";
const HomeScreen = () => {
  const accessToken = "f04dfd05dc14418dac62ddb90900e1d4";
  const query = "";
  const [eenzaamsLied, setEenzaamsLied] = useState([]);
  async function getHetEenzaamsteNummers() {
    const access_token = await AsyncStorage.getItem("token");
    console.log(access_token);
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=1&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA&min_popularity=0&max_popularity=0&target_popularity=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {},
      }
    );
    if (!response.ok) {
      throw new Error("Fail to Fetch");
    }
    const data = await response.json();
    setEenzaamsLied(data.tracks);
  }
  useEffect(() => {
    getHetEenzaamsteNummers();
  }, []);
  console.log(eenzaamsLied);

  return (
    <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ marginHorizontal: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Het eenzaamste nummers
          </Text>
        </View>

        <FlatList
          data={eenzaamsLied}
          renderItem={({ item }) => <SongItem item={item} />}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
