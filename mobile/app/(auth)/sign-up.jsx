import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email";

const SignUpScreen = () => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded || loading) return;

    if (!email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (password.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account";

      Alert.alert("Error", message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification)
    return (
      <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
    );

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={authStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image container */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>
          <Text style={authStyles.title}>Create Account</Text>
          <View style={authStyles.inputContainer}>
            {/* Email Input */}
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Email"
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none "
            />
          </View>

          {/* password input */}
          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter Password"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
          {/* sign up button  */}
          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Create Account..." : "Sign up"}
            </Text>
          </TouchableOpacity>
          {/* sign in link */}
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.back()}
          >
            <Text style={authStyles.linkText}>
              {" "}
              Already has an Account?
              <Text style={authStyles.link}>sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
