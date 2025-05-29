import { getLineHeight, rf, rh, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7B1513",
        tabBarInactiveTintColor: "#71727A",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          paddingBottom: rs(42),
          height: rh(96),
        },
        tabBarLabelStyle: {
          fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
          fontSize: rf(10),
          lineHeight: getLineHeight(rf(10), 1.4),
          letterSpacing: 0.15,
          marginTop: rs(8),
        },
        tabBarIconStyle: {
          marginBottom: rs(-4),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={rf(20)}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: "Favourites",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={rf(20)}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={rf(20)}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={rf(20)}
              color={color}
            />
          ),
        }}
      />
      {/* Hide the explore screen from tabs */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
