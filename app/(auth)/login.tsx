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
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";

import {
  SignInDocument,
  type SignInMutation,
  type SignInMutationVariables,
} from "../../src/generated/graphql";
import { loginSchema, type LoginForm } from "../../src/schemas/auth";

export default function LoginRoute() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const [signIn, { loading, error }] = useMutation<SignInMutation, SignInMutationVariables>(SignInDocument);

  const onSubmit = async (values: LoginForm) => {
    const res = await signIn({ variables: { input: { email: values.email, password: values.password } } });
    const token = res.data?.signIn?.token;
    if (token) {
      await AsyncStorage.setItem("token", token);
      router.replace("/(app)");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-8 pb-10">
            <View className="items-center mb-10">
              <Image
                source={require("../../assets/ruk-logo.png")}
                className="w-20 h-20 mb-4"
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold text-gray-900 tracking-tight">Sign in</Text>
              <Text className="text-gray-500 mt-2 text-center text-sm">Access your account to continue.</Text>
            </View>

            <View className="gap-4">
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-gray-700 ml-1">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <TextInput
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="w-full bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white"
                      />
                      {error?.message ? (
                        <Text className="text-red-600 mt-1 text-xs ml-1">{error.message}</Text>
                      ) : null}
                    </>
                  )}
                />
              </View>

              <View className="gap-1.5">
                <Text className="text-sm font-medium text-gray-700 ml-1">Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <>
                      <View className="relative justify-center">
                        <TextInput
                          placeholder="Password"
                          placeholderTextColor="#9CA3AF"
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                          className="w-full bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900 border-2 border-transparent focus:border-blue-500 focus:bg-white pr-16"
                        />
                        <Pressable
                          onPress={() => setShowPassword((s) => !s)}
                          className="absolute right-4 p-2"
                        >
                          <Text className="text-gray-500 text-xs font-bold uppercase">
                            {showPassword ? "Hide" : "Show"}
                          </Text>
                        </Pressable>
                      </View>
                      {error?.message ? (
                        <Text className="text-red-600 mt-1 text-xs ml-1">{error.message}</Text>
                      ) : null}
                    </>
                  )}
                />
              </View>

              {error?.message ? (
                <View className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <Text className="text-red-600 text-sm text-center">{error.message}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className={`bg-blue-600 rounded-xl py-4 items-center shadow-sm shadow-blue-200 mt-2 ${loading ? "opacity-70" : ""}`}
              >
                <Text className="text-white font-bold text-base">
                  {loading ? "Signing in..." : "Sign in"}
                </Text>
              </Pressable>
            </View>

            <View className="mt-8 flex-row justify-center gap-1">
              <Text className="text-gray-600">Don’t have an account?</Text>
              <Pressable onPress={() => router.push("/(auth)/signup")}>
                <Text className="text-blue-600 font-bold">Create account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
