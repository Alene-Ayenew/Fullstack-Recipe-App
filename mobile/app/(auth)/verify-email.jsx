import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useSignUp } from "@clerk/expo";
import { authStyles } from "../../assets/styles/auth.styles";

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState();
  const [loading, setLoading] = useState(false);
  const handleVerification = async () => {
    if (!loading) return;
    setLoading(true);
    try {
      const SignUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (SignUpAttempt.status === "complete") {
        await setActive({ session: SignUpAttempt.createdSession });
      } else {
        Alert.alert("Error", "verification failed. please try again");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "verification failed ",
      );
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      <Text style={authStyles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={authStyles.keyboardView}
          keyboardVerticalOffset={Platform.OS == "ios" ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={authStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Image Container */}
            <View style={authStyles.imageContainer}>
              <Image
                source={require("../../assets/images/i3.png")}
                style={authStyles.image}
                contentFit="contain"
              />
            </View>
            {/* title */}
            <Text style={authStyles.title}>Verify your email</Text>
            <Text style={authStyles.subtitle}>
              we&amps;ve sent a verification code to {email}{" "}
            </Text>
            <View style={authStyles.formContainer}>
              <View style={authStyles.textInput}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="enter verification code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
              </View>
              {/* verify button */}
              <TouchableOpacity
                style={[
                  authStyles.authButton,
                  loading && authStyles.buttonDisabled,
                ]}
                onPress={handleVerification}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {" "}
                  {loading ? "Verifying...." : "Verify Email"}{" "}
                </Text>
              </TouchableOpacity>
              {/* back to signup */}
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={onBack}
              >
                <Text style={authStyles.linkText}>Back To Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Text>
    </View>
  );
};

export default VerifyEmail;
