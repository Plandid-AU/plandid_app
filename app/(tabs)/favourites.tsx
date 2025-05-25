import { getLineHeight, rf, rs } from "@/constants/Responsive";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function FavouritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Favourites</Text>
        <Text style={styles.subtitle}>
          Your favourite vendors will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: rs(20),
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(24),
    lineHeight: getLineHeight(rf(24), 1.2),
    color: "#000000",
    marginBottom: rs(8),
  },
  subtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.375),
    color: "#71727A",
    textAlign: "center",
  },
});
