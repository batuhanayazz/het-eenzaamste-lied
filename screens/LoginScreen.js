import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  ResponseType,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "f04dfd05dc14418dac62ddb90900e1d4",
      clientSecret: "0ec8418f408541d68d7e76a8b9062cdd",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
      ],
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://192.168.0.253:8081/",
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      AsyncStorage.setItem("token", access_token);
      console.log("accessToken", access_token);
      navigation.navigate("Main");
    }
  }, [response]);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={80}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Millions of Songs Free on spotify!
        </Text>

        <View style={{ height: 80 }} />
        <Pressable
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
          style={{
            backgroundColor: "#1DB954",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <Text>Sign In with spotify</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
