import { StyleSheet, Text, ScrollView, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { View } from "react-native";
import { set } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SongItem from "../components/SongItem";
import { useNavigation } from "@react-navigation/native";
import { Player } from "../PlayerContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentTrack, setCurrentTrack] = useContext(Player);

  const [eenzaamsLied, setEenzaamsLied] = useState([]);
  async function getHetEenzaamsteNummers() {
    const access_token = await AsyncStorage.getItem("token");
    console.log(access_token);
    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?offset=0&limit=50`,
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
    setEenzaamsLied(data.items);
  }
  useEffect(() => {
    getHetEenzaamsteNummers();
  }, []);
  console.log(eenzaamsLied);

  const playTrack = async () => {
    if (eenzaamsLied.length > 0) {
      setCurrentTrack(eenzaamsLied[0]);
    }
    await play(eenzaamsLied[0]);
  };

  const play = async () => {};

  return (
    <>
      <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
        <ScrollView style={{ marginTop: 50 }}>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              Het eenzaamste nummers
            </Text>
            <Pressable
              style={{
                alignItems: "flex-end",
                marginTop: 9,
              }}
            >
              <Pressable
                onPress={playTrack}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1DB954",
                }}
              >
                <Entypo name="controller-play" size={24} color="white" />
              </Pressable>
            </Pressable>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={eenzaamsLied}
            renderItem={({ item }) => <SongItem item={item} />}
          />
        </ScrollView>
      </LinearGradient>



      
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
