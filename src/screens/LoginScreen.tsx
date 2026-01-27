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

import { SignInDocument, type SignInMutation, type SignInMutationVariables } from "../generated/graphql";
import { signInSchema, type SignInForm } from "../schemas/auth";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const [signIn, { loading, error }] = useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const res = await signIn({ variables: { input: { email, password } } });
      const token = res.data?.signIn?.token;

      if (token) {
        await AsyncStorage.setItem("token", token);
        router.replace("/(app)");
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
              <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</Text>
              <Text className="text-gray-500 mb-8">Sign in to continue</Text>

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
                <Text className="text-white font-bold text-lg">{loading ? "Signing in..." : "Sign In"}</Text>
              </Pressable>

              {/* Footer */}
              <View className="mt-8 flex-row justify-center gap-1">
                <Text className="text-gray-600">Don’t have an account?</Text>
                <Link href="/(auth)/signup" asChild>
                  <Pressable>
                    <Text className="text-blue-600 font-bold">Sign up now</Text>
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
