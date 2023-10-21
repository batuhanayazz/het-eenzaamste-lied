import { StyleSheet, Text, ScrollView, FlatList, Image } from "react-native";
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
import { BottomModal, ModalContent } from "react-native-modals";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [modalVisible, setModalVisible] = useState(false);
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
  console.log(currentTrack);
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

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: "#5072A7",
            width: "90%",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 40,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTrack?.track.name} - {currentTrack?.track.artists[0].name}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
      >
        <ModalContent
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "#5072A7",
          }}
        >
          <View style={{ height: "100%", width: "100%", marginTop: 30 }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AntDesign name="down" size={24} color="white" />
              <Text
                style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
              >
                {currentTrack?.track?.name}
              </Text>

              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>
            <View style={{ height: 70 }} />
            <View style={{ padding: 10 }} />
            <Image
              style={{
                width: "100%",
                height: 330,
                borderRadius: 4,
              }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <View>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {currentTrack?.track?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: "#D3D3D3",
                    marginTop: 10,
                  }}
                >
                  {currentTrack?.track?.artists[0].name}
                </Text>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
