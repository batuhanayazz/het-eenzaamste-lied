import { StyleSheet, Text, ScrollView, FlatList, Image } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SongItem from "../components/SongItem";
import { useNavigation } from "@react-navigation/native";
import { Player } from "../PlayerContext";
import { BottomModal, ModalContent } from "react-native-modals";
import { Audio } from "expo-av";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [modalVisible, setModalVisible] = useState(false);
  const [eenzaamsLied, setEenzaamsLied] = useState([]);
  const value = useRef(0);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
  //console.log(eenzaamsLied);

  const playTrack = async () => {
    if (eenzaamsLied.length > 0) {
      setCurrentTrack(eenzaamsLied[0]);
    }
    await play(eenzaamsLied[0]);
  };

  const play = async (nextTrack) => {
    //console.log(nextTrack);
    const preview_url = nextTrack?.track?.preview_url;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        },
        {
          shouldPlay: true,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      onPlaybackStatusUpdate(status);
      //console.log(status);
      setCurrentSound(sound);
      setIsPlaying(status.isLoaded);
      await sound.playAsync();
    } catch (error) {
      console.log(error.message);
    }
  };
  const onPlaybackStatusUpdate = async (status) => {
    //console.log(status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      //console.log("progresss", progress);
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish === true) {
      setCurrentSound(null);
      playNextTrack();
    }
  };

  const circleSize = 12;
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < eenzaamsLied.length) {
      const nextTrack = eenzaamsLied[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };
  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current < eenzaamsLied.length) {
      const nextTrack = eenzaamsLied[value.current];
      setCurrentTrack(nextTrack);

      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };
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
            renderItem={({ item }) => (
              <SongItem
                item={item}
                onPress={play}
                isPlaying={item === currentTrack}
              />
            )}
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
              <AntDesign
                onPress={() => setModalVisible(!modalVisible)}
                name="down"
                size={24}
                color="white"
              />
              <Text
                style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
              >
                {currentTrack?.track?.name}
              </Text>

              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>
            <View style={{ height: 30 }} />
            <View style={{ padding: 10 }} />
            <Image
              style={{
                width: "100%",
                height: 330,
                borderRadius: 4,
              }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
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
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  width: "100%",
                  marginTop: 10,
                  height: 3,
                  backgroundColor: "gray",
                  borderRadius: 5,
                }}
              >
                <View
                  style={[styles.progressbar, { width: `${progress * 100}%` }]}
                />
                <View
                  style={[
                    {
                      position: "absolute",
                      top: -5,
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      backgroundColor: "white",
                    },
                    {
                      left: `${progress * 100}%`,
                      marginLeft: -circleSize / 2,
                    },
                  ]}
                />
              </View>
              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "white", fontSize: 15 }}>
                  {formatTime(currentTime)}
                </Text>
                <Text style={{ color: "white", fontSize: 15 }}>
                  {formatTime(totalDuration)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 17,
              }}
            >
              <Pressable>
                <FontAwesome name="arrows" size={30} color="#03C03C" />
              </Pressable>
              <Pressable>
                <Ionicons
                  onPress={playPreviousTrack}
                  name="play-skip-back"
                  size={30}
                  color="white"
                />
              </Pressable>
              <Pressable onPress={handlePlayPause}>
                {isPlaying ? (
                  <AntDesign name="pausecircle" size={60} color="white" />
                ) : (
                  <Pressable
                    onPress={handlePlayPause}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Entypo name="controller-play" size={26} color="black" />
                  </Pressable>
                )}
              </Pressable>
              <Pressable onPress={playNextTrack}>
                <Ionicons name="play-skip-forward" size={30} color="white" />
              </Pressable>
              <Pressable>
                <Feather name="repeat" size={30} color="#03C03C" />
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: "100%",
    backgroundColor: "white",
  },
});
