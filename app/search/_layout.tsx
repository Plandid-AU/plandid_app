import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_bottom",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
