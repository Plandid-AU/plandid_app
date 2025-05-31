import { Stack } from "expo-router";

export default function QuotesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="instant-quote"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
