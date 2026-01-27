import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import { useMutation } from "@apollo/client/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignUpDocument, type SignUpMutation, type SignUpMutationVariables } from "../generated/graphql";
import { signUpSchema, type SignUpForm } from "../schemas/auth";

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const [signUp, { loading, error }] = useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument);

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    try {
      const res = await signUp({ variables: { input: { name, email, password } } });
      const token = res.data?.signUp?.token;

      if (token) {
        await AsyncStorage.setItem("token", token);
        router.replace("/(app)");
      } else {
        // if API doesn't return token, go back to login
        router.replace("/(auth)/login");
      }
    } catch (e) {
      console.log(e);
    }
  });

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View className="flex-1 px-6 py-10">
              {/* Logo */}
              <View className="items-center mb-10">
                <Image
                  source={require("../../assets/ruk-logo.png")}
                  className="w-40 h-20"
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text className="text-3xl font-bold text-gray-900 mb-2">Create your account 🚀</Text>
              <Text className="text-gray-500 mb-8">Sign up to continue</Text>

              {/* Name */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Name</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                      placeholder="Your name"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.name ? <Text className="text-red-600 mt-1">{errors.name.message}</Text> : null}
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                      placeholder="you@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.email ? <Text className="text-red-600 mt-1">{errors.email.message}</Text> : null}
              </View>

              {/* Password */}
              <View className="mb-2">
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                      placeholder="••••••••"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.password ? (
                  <Text className="text-red-600 mt-1">{errors.password.message}</Text>
                ) : null}
              </View>

              {/* Show password toggle */}
              <Pressable className="mb-6" onPress={() => setShowPassword(!showPassword)}>
                <Text className="text-gray-500">{showPassword ? "Hide password" : "Show password"}</Text>
              </Pressable>

              {/* Errors */}
              {error ? <Text className="text-red-600 mb-4">{error.message}</Text> : null}

              {/* Button */}
              <Pressable
                className={`rounded-xl py-4 items-center ${loading ? "bg-gray-300" : "bg-blue-600"}`}
                onPress={onSubmit}
                disabled={loading}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Creating..." : "Create account"}
                </Text>
              </Pressable>

              {/* Footer */}
              <View className="mt-8 flex-row justify-center gap-1">
                <Text className="text-gray-600">Already have an account?</Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <Text className="text-blue-600 font-bold">Sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
