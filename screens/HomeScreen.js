import { StyleSheet, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { View } from "react-native";
import { set } from "lodash";
const HomeScreen = () => {
  const accessToken = "f04dfd05dc14418dac62ddb90900e1d4";
  const query = "";
  const [eenzaamsLied, setEenzaamsLied] = useState([]);
  async function getHetEenzaamsteNummers() {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {},
      }
    );
    if (response.ok) {
      throw new Error("Fail to Fetch ");
    }
    const data = await response.json();
    setEenzaamsLied(data.items);
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
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
