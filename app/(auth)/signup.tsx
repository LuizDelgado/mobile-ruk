import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";

import {
  SignUpDocument,
  type SignUpMutation,
  type SignUpMutationVariables,
  type TelephoneInput,
} from "../../src/generated/graphql";
import { signUpSchema, type SignUpForm } from "../../src/schemas/auth";

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold text-gray-700">{label}</Text>
      {children}
      {error ? <Text className="text-red-600 text-xs">{error}</Text> : null}
    </View>
  );
}

export default function SignUpRoute() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [ddd, setDdd] = useState("");
  const [number, setNumber] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      telephones: [],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "telephones",
  });

  const [signUp, { loading, error }] = useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument);

  const canAddPhone = useMemo(() => {
    const cleanDDD = ddd.trim();
    const cleanNumber = number.trim();
    return cleanDDD.length === 2 && cleanNumber.length >= 8;
  }, [ddd, number]);

  const addPhone = () => {
    const cleanDDD = ddd.trim();
    const cleanNumber = number.trim();

    if (cleanDDD.length !== 2) return;
    if (cleanNumber.length < 8) return;

    append({ area_code: cleanDDD, number: cleanNumber } as TelephoneInput);
    setDdd("");
    setNumber("");

    setValue("telephones", getValues("telephones"), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: SignUpForm) => {
    await signUp({
      variables: {
        input: {
          name: values.name,
          email: values.email,
          password: values.password,
          telephones: values.telephones,
        },
      },
    });

    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 py-8">
            {/* Card */}
            <View className="w-full max-w-xl self-center rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
              {/* Header */}
              <View className="items-center gap-2 pb-6">
                <Image
                  source={require("../../assets/ruk-logo.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
                <View className="items-center">
                  <Text className="text-xl font-semibold text-gray-900">Create account</Text>
                  <Text className="text-sm text-gray-500 mt-1 text-center">
                    Enter your details to create your account.
                  </Text>
                </View>
              </View>

              {/* Form */}
              <View className="gap-5">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { value, onChange }, fieldState: { error: e } }) => (
                    <Field label="Full name" error={e?.message}>
                      <TextInput
                        placeholder="e.g. Luiz Felipe"
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="words"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base text-gray-900"
                      />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange }, fieldState: { error: e } }) => (
                    <Field label="Email" error={e?.message}>
                      <TextInput
                        placeholder="you@company.com"
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-base text-gray-900"
                      />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange }, fieldState: { error: e } }) => (
                    <Field label="Password" error={e?.message}>
                      <View className="relative justify-center">
                        <TextInput
                          placeholder="Minimum 8 characters"
                          placeholderTextColor="#9CA3AF"
                          value={value}
                          onChangeText={onChange}
                          secureTextEntry={!showPassword}
                          autoCapitalize="none"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 pr-20 text-base text-gray-900"
                        />
                        <Pressable
                          onPress={() => setShowPassword((s) => !s)}
                          className="absolute right-3 rounded-lg px-3 py-2"
                          accessibilityRole="button"
                          accessibilityLabel="Toggle password visibility"
                        >
                          <Text className="text-xs font-semibold text-gray-600">
                            {showPassword ? "Hide" : "Show"}
                          </Text>
                        </Pressable>
                      </View>
                    </Field>
                  )}
                />

                {/* Phones */}
                <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <View className="mb-3">
                    <Text className="text-sm font-semibold text-gray-900">Telephone (optional)</Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Add one or more phone numbers if needed.
                    </Text>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="w-20">
                      <TextInput
                        placeholder="DDD"
                        placeholderTextColor="#9CA3AF"
                        value={ddd}
                        onChangeText={(t) => setDdd(t.replace(/\D/g, "").slice(0, 2))}
                        keyboardType="numeric"
                        maxLength={2}
                        className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-gray-900"
                      />
                    </View>

                    <View className="flex-1">
                      <TextInput
                        placeholder="Number"
                        placeholderTextColor="#9CA3AF"
                        value={number}
                        onChangeText={(t) => setNumber(t.replace(/\D/g, ""))}
                        keyboardType="numeric"
                        className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-900"
                      />
                    </View>

                    <Pressable
                      onPress={addPhone}
                      disabled={!canAddPhone}
                      className={`rounded-xl px-4 justify-center items-center ${
                        canAddPhone ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <Text className="text-white text-sm font-semibold">Add</Text>
                    </Pressable>
                  </View>

                  {fields.length > 0 ? (
                    <View className="flex-row flex-wrap gap-2 mt-3">
                      {fields.map((t, idx) => (
                        <View
                          key={t.id}
                          className="flex-row items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2"
                        >
                          <Text className="text-xs font-medium text-gray-800">
                            ({(t as any).area_code}) {(t as any).number}
                          </Text>
                          <Pressable onPress={() => remove(idx)} className="rounded-full px-2 py-1">
                            <Text className="text-xs font-semibold text-red-600">Remove</Text>
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>

                {error?.message ? (
                  <View className="rounded-xl border border-red-100 bg-red-50 p-3">
                    <Text className="text-sm text-red-700 text-center">{error.message}</Text>
                  </View>
                ) : null}

                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={loading || isSubmitting}
                  className={`rounded-xl py-4 items-center ${
                    loading || isSubmitting ? "bg-gray-400" : "bg-blue-600"
                  }`}
                >
                  <Text className="text-white font-semibold text-base">
                    {loading || isSubmitting ? "Creating..." : "Create account"}
                  </Text>
                </Pressable>

                <View className="flex-row justify-center gap-2 pt-2">
                  <Text className="text-sm text-gray-600">Already have an account?</Text>
                  <Pressable onPress={() => router.replace("/(auth)/login")}>
                    <Text className="text-sm font-semibold text-blue-600">Sign in</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Footer spacing */}
            <View className="h-8" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
