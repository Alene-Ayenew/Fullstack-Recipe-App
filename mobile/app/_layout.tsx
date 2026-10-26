
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { SafeAreaView } from "react-native";
import {COLORS} from "../constants/colors"
const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!publishableKey) {
    throw new Error("Missing Clerk Publishable Key in .env");
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
    >
      <SafeAreaView style={{flex:1,backgroundColor:COLORS.backgrouns}}>
        <Slot />
      </SafeAreaView>
      
    </ClerkProvider>
  );
}
