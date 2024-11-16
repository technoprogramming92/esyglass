import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClerkProvider } from "@clerk/clerk-expo";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
import * as SecureStore from "expo-secure-store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen
          name='signup'
          options={{ title: "", headerBackTitle: "" }}
        />
        <Stack.Screen
          name='login'
          options={{
            title: "",
            headerBackTitle: "",
            headerRight: () => (
              <Link href={"/help"} asChild>
                <TouchableOpacity>
                  <Ionicons
                    name='help-circle-outline'
                    size={34}
                    color='black'
                  />
                </TouchableOpacity>
              </Link>
            ),
          }}
        />
        <Stack.Screen
          name='help'
          options={{ title: "Help", presentation: "modal" }}
        />
         <Stack.Screen
          name='home'
          options={{ title: "Home", presentation: "modal" }}
        />
      </Stack>
    </ClerkProvider>
  );
}
