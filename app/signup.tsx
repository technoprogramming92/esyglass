import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { disableErrorHandling } from "expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const Page = () => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const onSignup = async () => {};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get Started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your Phone Number. We will send you a verification code.
        </Text>
        <View style={styles.inputConatainer}>
          <TextInput
            style={[styles.input, { width: 100 }]}
            placeholder='Country Code'
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />
          <TextInput
            placeholder='Mobile Number'
            keyboardType='phone-pad'
            style={[styles.input, { flex: 1 }]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.inputConatainer}>
          <TextInput
            placeholder='Company ID'
            keyboardType='default'
            style={[styles.input, { flex: 1 }]}
            value={companyId}
            onChangeText={setCompanyId}
          />
        </View>
        <View style={styles.inputConatainer}>
          <TextInput
            placeholder='Password'
            keyboardType='visible-password'
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputConatainer}>
          <TextInput
            placeholder='Confirm Password'
            keyboardType='visible-password'
            style={[styles.input, { flex: 1 }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <Link href={"/login"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
            { backgroundColor: Colors.dark, marginBottom: 20 },
          ]}
          onPress={onSignup}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputConatainer: {
    marginVertical: 10,
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
