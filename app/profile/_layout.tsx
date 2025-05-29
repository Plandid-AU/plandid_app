import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="your-details" />
      <Stack.Screen name="wedding-details" />
      <Stack.Screen name="my-quotes" />
      <Stack.Screen name="your-partner" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="privacy-security" />
    </Stack>
  );
}
