import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For session management

const Page = () => {
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  const onSignin = async () => {
    try {
      // Validate input fields
      if (!companyId || !password) {
        Alert.alert("Error", "Please enter both Company ID and Password.");
        return;
      }

      // Fetch users from the API
      const response = await axios.get(
        "https://6736c416aafa2ef2223171a1.mockapi.io/esyapi/users"
      );

      const users = response.data;

      // Find user matching the credentials
      const user = users.find(
        (u) => u.companyId === companyId && u.password === password
      );

      if (user) {
        // Save user data in AsyncStorage for session
        await AsyncStorage.setItem("user", JSON.stringify(user));
        router.push("/home")
        // Navigate to another page (e.g., Dashboard)
      } else {
        Alert.alert("Error", "Invalid Company ID or Password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert(
        "Error",
        "An error occurred while logging in. Please try again later."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome Back</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your company ID and Password Below to Login.
        </Text>

        <View style={styles.inputConatainer}>
          <TextInput
            placeholder="Company ID"
            keyboardType="default"
            style={[styles.input, { flex: 1 }]}
            value={companyId}
            onChangeText={setCompanyId}
          />
        </View>
        <View style={styles.inputConatainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={true} // Mask password
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Link href={"/signup"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Don't have an account? Signup
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            companyId !== "" ? styles.enabled : styles.disabled,
            { backgroundColor: Colors.dark, marginBottom: 20 },
          ]}
          onPress={onSignin}
        >
          <Text style={defaultStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputConatainer: {
    marginVertical: 15,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 15,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default Page;
